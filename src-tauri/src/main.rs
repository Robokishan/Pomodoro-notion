use base64::prelude::{Engine as _, BASE64_URL_SAFE_NO_PAD};
use rand::{distributions::Alphanumeric, Rng};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::menu::{Menu, MenuItem};
use tauri::plugin::Builder as PluginBuilder;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Emitter, Manager, Runtime, State, Theme, Webview};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_opener::OpenerExt;
use url::Url;

mod native_titlebar;

const DEV_OAUTH_REDIRECT_URI: &str = "http://localhost:3000/auth/complete";
const PROD_OAUTH_REDIRECT_URI: &str = "pomodoro-notion://auth/complete";
const GOOGLE_AUTH_URL: &str = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL: &str = "https://oauth2.googleapis.com/token";

#[derive(Clone)]
struct PendingAuth {
    state: String,
    code_verifier: String,
    redirect_uri: String,
}

#[derive(Clone)]
struct DesktopAuthState(Arc<Mutex<Option<PendingAuth>>>);

#[derive(Deserialize, Serialize)]
struct GoogleTokenResponse {
    access_token: String,
    expires_in: Option<u64>,
    id_token: Option<String>,
    refresh_token: Option<String>,
    scope: Option<String>,
    token_type: String,
}

#[derive(Clone, Serialize)]
struct AuthSuccessPayload {
    provider: &'static str,
    id_token: String,
}

fn should_open_in_system_browser(url: &Url) -> bool {
    matches!(
        url.host_str(),
        Some("accounts.google.com" | "oauth2.googleapis.com")
    )
}

fn open_in_system_browser<R: Runtime>(webview: &Webview<R>, url: &Url) {
    let _ = webview
        .app_handle()
        .opener()
        .open_url(url.as_str(), None::<&str>);
}

fn app_base_url() -> &'static str {
    if cfg!(debug_assertions) {
        "http://localhost:3001"
    } else {
        "https://pomodoro.kishanjoshi.dev"
    }
}

fn oauth_redirect_uri() -> &'static str {
    if cfg!(debug_assertions) {
        DEV_OAUTH_REDIRECT_URI
    } else {
        PROD_OAUTH_REDIRECT_URI
    }
}

fn is_desktop_auth_url(url: &Url) -> bool {
    url.scheme() == "pomodoro-notion"
        && url.host_str() == Some("auth")
        && url.path() == "/complete"
}

fn navigate_main_window(app: &AppHandle, url: &str) {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(url) = url.parse() {
            let _ = window.navigate(url);
        }
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn show_main_window(app: &AppHandle) {
    navigate_main_window(app, app_base_url());
}

fn focus_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn random_string(length: usize) -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(length)
        .map(char::from)
        .collect()
}

fn pkce_challenge(verifier: &str) -> String {
    let digest = Sha256::digest(verifier.as_bytes());
    BASE64_URL_SAFE_NO_PAD.encode(digest)
}

fn read_env_value(name: &str) -> Option<String> {
    if let Ok(value) = std::env::var(name) {
        if !value.is_empty() {
            return Some(value);
        }
    }

    let current_dir = std::env::current_dir().ok()?;
    for path in [current_dir.join(".env"), current_dir.join("../.env")] {
        let Ok(contents) = fs::read_to_string(path) else {
            continue;
        };

        for line in contents.lines() {
            let Some((key, value)) = line.split_once('=') else {
                continue;
            };

            if key.trim() == name {
                let value = value.trim().trim_matches('"').to_string();
                if !value.is_empty() {
                    return Some(value);
                }
            }
        }
    }

    None
}

fn google_client_id() -> Result<String, String> {
    read_env_value("GOOGLE_CLIENT_ID").ok_or_else(|| "GOOGLE_CLIENT_ID is missing".to_string())
}

fn build_google_auth_url(pending: &PendingAuth) -> Result<String, String> {
    let mut url = Url::parse(GOOGLE_AUTH_URL).map_err(|error| error.to_string())?;
    url.query_pairs_mut()
        .append_pair("client_id", &google_client_id()?)
        .append_pair("redirect_uri", &pending.redirect_uri)
        .append_pair("response_type", "code")
        .append_pair("scope", "openid email profile")
        .append_pair("state", &pending.state)
        .append_pair("code_challenge", &pkce_challenge(&pending.code_verifier))
        .append_pair("code_challenge_method", "S256")
        .append_pair("access_type", "offline")
        .append_pair("prompt", "consent");

    Ok(url.to_string())
}

fn set_pending_auth(auth_state: &DesktopAuthState, pending: PendingAuth) -> Result<(), String> {
    let mut guard = auth_state
        .0
        .lock()
        .map_err(|_| "Could not lock pending auth state".to_string())?;
    *guard = Some(pending);
    Ok(())
}

fn take_pending_auth(
    auth_state: &DesktopAuthState,
    state: &str,
    redirect_uri: &str,
) -> Result<PendingAuth, String> {
    let mut guard = auth_state
        .0
        .lock()
        .map_err(|_| "Could not lock pending auth state".to_string())?;

    let pending = guard
        .as_ref()
        .ok_or_else(|| "No Google sign-in request is pending".to_string())?;

    if pending.state != state {
        return Err("Google sign-in state did not match".to_string());
    }

    if pending.redirect_uri != redirect_uri {
        return Err("Google sign-in redirect URI did not match".to_string());
    }

    Ok(guard.take().expect("pending auth disappeared"))
}

async fn exchange_google_code(
    code: &str,
    pending: &PendingAuth,
) -> Result<GoogleTokenResponse, String> {
    let client_id = google_client_id()?;
    let client_secret = read_env_value("GOOGLE_CLIENT_SECRET");

    let mut params = vec![
        ("client_id", client_id),
        ("code", code.to_string()),
        ("code_verifier", pending.code_verifier.clone()),
        ("grant_type", "authorization_code".to_string()),
        ("redirect_uri", pending.redirect_uri.clone()),
    ];

    if let Some(client_secret) = client_secret {
        params.push(("client_secret", client_secret));
    }

    let body = url::form_urlencoded::Serializer::new(String::new())
        .extend_pairs(params.iter().map(|(key, value)| (*key, value.as_str())))
        .finish();

    let response = reqwest::Client::new()
        .post(GOOGLE_TOKEN_URL)
        .header(
            reqwest::header::CONTENT_TYPE,
            "application/x-www-form-urlencoded",
        )
        .body(body)
        .send()
        .await
        .map_err(|error| error.to_string())?;

    if !response.status().is_success() {
        return Err(format!(
            "Google token exchange failed: {}",
            response.status()
        ));
    }

    response.json().await.map_err(|error| error.to_string())
}

fn store_google_session(app: &AppHandle, tokens: &GoogleTokenResponse) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;

    let path = dir.join("google-session.json");
    let contents = serde_json::to_string(tokens).map_err(|error| error.to_string())?;
    fs::write(&path, contents).map_err(|error| error.to_string())?;

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut permissions = fs::metadata(&path)
            .map_err(|error| error.to_string())?
            .permissions();
        permissions.set_mode(0o600);
        fs::set_permissions(&path, permissions).map_err(|error| error.to_string())?;
    }

    Ok(())
}

async fn finish_google_auth(
    app: AppHandle,
    auth_state: DesktopAuthState,
    code: String,
    state: String,
    redirect_uri: &'static str,
) -> Result<(), String> {
    let pending = take_pending_auth(&auth_state, &state, redirect_uri)?;
    let tokens = exchange_google_code(&code, &pending).await?;
    store_google_session(&app, &tokens)?;

    let id_token = tokens
        .id_token
        .clone()
        .ok_or_else(|| "Google did not return an ID token".to_string())?;

    app.emit(
        "auth-success",
        AuthSuccessPayload {
            provider: "google",
            id_token: id_token.clone(),
        },
    )
    .map_err(|error| error.to_string())?;

    if let Some(window) = app.get_webview_window("main") {
        let id_token_json = serde_json::to_string(&id_token).map_err(|error| error.to_string())?;
        let _ = window.eval(format!(
            r#"
      fetch("/api/desktop/auth/google-session", {{
        method: "POST",
        headers: {{ "Content-Type": "application/json" }},
        body: JSON.stringify({{ idToken: {id_token_json} }}),
      }}).then((response) => {{
        if (!response.ok) throw new Error("Could not create desktop session");
        window.location.assign("/");
      }}).catch((error) => {{
        console.error("Desktop Google session failed", error);
      }});
      "#
        ));
        focus_main_window(&app);
    } else {
        show_main_window(&app);
    }
    Ok(())
}

fn parse_loopback_request(request_line: &str) -> Result<Url, String> {
    let path = request_line
        .split_whitespace()
        .nth(1)
        .ok_or_else(|| "OAuth callback request was malformed".to_string())?;
    Url::parse(&format!("http://localhost:3000{}", path)).map_err(|error| error.to_string())
}

fn write_loopback_response(mut stream: std::net::TcpStream, ok: bool) {
    let body = if ok {
        "Google sign-in is complete. You can return to the Pomodoro app."
    } else {
        "Google sign-in failed. Please return to the Pomodoro app and try again."
    };
    let status = if ok { "200 OK" } else { "400 Bad Request" };
    let response = format!(
    "HTTP/1.1 {status}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
    body.len()
  );
    let _ = stream.write_all(response.as_bytes());
}

fn finish_loopback_auth(
    app: AppHandle,
    auth_state: DesktopAuthState,
    code: String,
    state: String,
) -> bool {
    let (sender, receiver) = mpsc::channel();

    tauri::async_runtime::spawn(async move {
        let result = finish_google_auth(app, auth_state, code, state, DEV_OAUTH_REDIRECT_URI).await;
        if let Err(error) = &result {
            eprintln!("Google sign-in failed: {error}");
        }
        let _ = sender.send(result);
    });

    matches!(receiver.recv_timeout(Duration::from_secs(30)), Ok(Ok(())))
}

fn start_loopback_callback_server(
    app: AppHandle,
    auth_state: DesktopAuthState,
) -> Result<(), String> {
    let listener = TcpListener::bind("localhost:3000")
        .map_err(|error| format!("Could not start localhost OAuth callback server: {error}"))?;

    std::thread::spawn(move || {
        let Ok((stream, _)) = listener.accept() else {
            return;
        };

        let Ok(cloned_stream) = stream.try_clone() else {
            write_loopback_response(stream, false);
            return;
        };

        let mut reader = BufReader::new(cloned_stream);
        let mut request_line = String::new();
        let ok = reader.read_line(&mut request_line).is_ok_and(|_| {
            let Ok(url) = parse_loopback_request(&request_line) else {
                return false;
            };

            if url.path() != "/auth/complete" {
                return false;
            }

            let code = url
                .query_pairs()
                .find(|(key, _)| key == "code")
                .map(|(_, value)| value.to_string());
            let state = url
                .query_pairs()
                .find(|(key, _)| key == "state")
                .map(|(_, value)| value.to_string());

            let (Some(code), Some(state)) = (code, state) else {
                return false;
            };

            finish_loopback_auth(app.clone(), auth_state.clone(), code, state)
        });

        write_loopback_response(stream, ok);
    });

    Ok(())
}

#[tauri::command]
fn start_google_sign_in(
    app: AppHandle,
    auth_state: State<'_, DesktopAuthState>,
) -> Result<(), String> {
    let pending = PendingAuth {
        state: random_string(32),
        code_verifier: random_string(96),
        redirect_uri: oauth_redirect_uri().to_string(),
    };

    if cfg!(debug_assertions) {
        start_loopback_callback_server(app.clone(), auth_state.inner().clone())?;
    }

    set_pending_auth(auth_state.inner(), pending.clone())?;
    let auth_url = build_google_auth_url(&pending)?;
    app.opener()
        .open_url(auth_url, None::<&str>)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn start_window_drag(window: tauri::WebviewWindow) -> Result<(), String> {
    window.start_dragging().map_err(|error| error.to_string())
}

#[tauri::command]
fn set_timer_fullscreen(window: tauri::WebviewWindow, fullscreen: bool) -> Result<(), String> {
    window
        .set_fullscreen(fullscreen)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn set_desktop_theme(window: tauri::WebviewWindow, theme: String) -> Result<(), String> {
    let theme = match theme.as_str() {
        "light" => Some(Theme::Light),
        "dark" => Some(Theme::Dark),
        "system" => None,
        _ => return Err("Unknown desktop theme".to_string()),
    };

    window.set_theme(theme).map_err(|error| error.to_string())
}

fn main() {
    tauri::Builder::default()
        .manage(DesktopAuthState(Arc::new(Mutex::new(None))))
        .invoke_handler(tauri::generate_handler![
            start_google_sign_in,
            start_window_drag,
            set_timer_fullscreen,
            set_desktop_theme
        ])
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            PluginBuilder::<tauri::Wry>::new("desktop-navigation")
                .on_navigation(|webview, url| {
                    if should_open_in_system_browser(url) {
                        open_in_system_browser(webview, url);
                        false
                    } else {
                        true
                    }
                })
                .build(),
        )
        .setup(|app| {
            native_titlebar::install(app.handle());

            let _ = app.deep_link().register_all();
            let app_handle = app.handle().clone();
            let auth_state = app.state::<DesktopAuthState>().inner().clone();
            app.deep_link().on_open_url(move |event| {
                for url in event.urls() {
                    if !is_desktop_auth_url(&url) {
                        continue;
                    }

                    let code = url
                        .query_pairs()
                        .find(|(key, _)| key == "code")
                        .map(|(_, value)| value.to_string());
                    let state = url
                        .query_pairs()
                        .find(|(key, _)| key == "state")
                        .map(|(_, value)| value.to_string());

                    if let (Some(code), Some(state)) = (code, state) {
                        tauri::async_runtime::spawn(finish_google_auth(
                            app_handle.clone(),
                            auth_state.clone(),
                            code,
                            state,
                            PROD_OAUTH_REDIRECT_URI,
                        ));
                    } else {
                        show_main_window(&app_handle);
                    }
                }
            });

            let open = MenuItem::with_id(app, "open", "Open Pomodoro", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open, &quit])?;

            let icon = app
                .default_window_icon()
                .cloned()
                .ok_or_else(|| "default window icon is missing".to_string())?;

            TrayIconBuilder::with_id("pomodoro")
                .tooltip("Pomodoro for Notion")
                .icon(icon)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => show_main_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main_window(&tray.app_handle());
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Pomodoro for Notion desktop app");
}
