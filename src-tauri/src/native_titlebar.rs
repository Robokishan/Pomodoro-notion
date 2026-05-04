#[cfg(target_os = "macos")]
mod macos {
    use objc2::rc::Retained;
    use objc2::runtime::NSObject;
    use objc2::{define_class, msg_send, sel, AnyThread, MainThreadMarker};
    use objc2_app_kit::{
        NSBezelStyle, NSButton, NSCellImagePosition, NSColor, NSImage, NSImageScaling,
        NSTitlebarSeparatorStyle, NSWindow, NSWindowButton, NSWindowTitleVisibility,
    };
    use objc2_foundation::{ns_string, NSObjectProtocol, NSPoint, NSRect, NSSize};
    use std::sync::OnceLock;
    use tauri::{AppHandle, Manager};

    static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();
    const NAV_BUTTON_SIZE: f64 = 28.0;
    const NAV_BUTTON_SPACING: f64 = 36.0;
    const NAV_ICON_SIZE: f64 = 15.0;
    const NAV_AFTER_TRAFFIC_GAP: f64 = 28.0;

    fn eval_on_main_window(script: &str) {
        let Some(app) = APP_HANDLE.get() else {
            return;
        };
        let Some(window) = app.get_webview_window("main") else {
            return;
        };
        let _ = window.eval(script);
    }

    define_class!(
        #[unsafe(super(NSObject))]
        #[thread_kind = AnyThread]
        struct NavigationTarget;

        impl NavigationTarget {
            #[unsafe(method(home:))]
            fn home(&self, _sender: &NSObject) {
                eval_on_main_window("window.location.assign('/');");
            }

            #[unsafe(method(back:))]
            fn back(&self, _sender: &NSObject) {
                eval_on_main_window(
                    "if (window.history.length > 1) { window.history.back(); } else { window.location.assign('/'); }",
                );
            }

            #[unsafe(method(forward:))]
            fn forward(&self, _sender: &NSObject) {
                eval_on_main_window("window.history.forward();");
            }
        }

        unsafe impl NSObjectProtocol for NavigationTarget {}
    );

    impl NavigationTarget {
        fn new() -> Retained<Self> {
            let this = Self::alloc().set_ivars(());
            unsafe { msg_send![super(this), init] }
        }
    }

    fn symbol_button(
        symbol_name: &'static objc2_foundation::NSString,
        label: &'static objc2_foundation::NSString,
        target: &NavigationTarget,
        action: objc2::runtime::Sel,
        x: f64,
        mtm: MainThreadMarker,
    ) -> Retained<NSButton> {
        let image = NSImage::imageWithSystemSymbolName_accessibilityDescription(
            symbol_name,
            Some(label),
        )
        .unwrap_or_else(|| NSImage::imageNamed(symbol_name).expect("navigation symbol should exist"));

        image.setTemplate(true);
        image.setSize(NSSize::new(NAV_ICON_SIZE, NAV_ICON_SIZE));

        let button = unsafe {
            NSButton::buttonWithImage_target_action(&image, Some(target), Some(action), mtm)
        };
        button.setFrame(NSRect::new(
            NSPoint::new(x, 0.0),
            NSSize::new(NAV_BUTTON_SIZE, NAV_BUTTON_SIZE),
        ));
        button.setBezelStyle(NSBezelStyle::AccessoryBarAction);
        button.setBordered(false);
        button.setImagePosition(NSCellImagePosition::ImageOnly);
        button.setImageScaling(NSImageScaling::ScaleProportionallyDown);
        button.setContentTintColor(Some(&NSColor::secondaryLabelColor()));
        button.setToolTip(Some(label));
        button
    }

    pub fn install(app: &AppHandle) {
        let _ = APP_HANDLE.set(app.clone());

        let Some(mtm) = MainThreadMarker::new() else {
            return;
        };
        let Some(window) = app.get_webview_window("main") else {
            return;
        };
        let Ok(ns_window_ptr) = window.ns_window() else {
            return;
        };

        let ns_window = unsafe { &*(ns_window_ptr.cast::<NSWindow>()) };
        ns_window.setTitleVisibility(NSWindowTitleVisibility::Hidden);
        ns_window.setTitlebarAppearsTransparent(true);
        ns_window.setTitlebarSeparatorStyle(NSTitlebarSeparatorStyle::None);
        ns_window.setMovable(true);
        ns_window.setMovableByWindowBackground(true);

        let target = NavigationTarget::new();
        let Some(close_button) = ns_window.standardWindowButton(NSWindowButton::CloseButton) else {
            return;
        };
        let Some(minimize_button) =
            ns_window.standardWindowButton(NSWindowButton::MiniaturizeButton)
        else {
            return;
        };
        let titlebar_container = unsafe {
            close_button
                .superview()
                .and_then(|view| view.superview())
        };
        let Some(titlebar_container) = titlebar_container else {
            return;
        };

        let close_frame = close_button.frame();
        let minimize_frame = minimize_button.frame();
        let traffic_gap = minimize_frame.origin.x - close_frame.origin.x;
        let nav_start_x = close_frame.origin.x + (traffic_gap * 2.0) + NAV_AFTER_TRAFFIC_GAP;
        let nav_y = close_frame.origin.y - ((NAV_BUTTON_SIZE - close_frame.size.height) / 2.0);

        let home = symbol_button(
            ns_string!("house"),
            ns_string!("Home"),
            &target,
            sel!(home:),
            nav_start_x,
            mtm,
        );
        let back = symbol_button(
            ns_string!("chevron.left"),
            ns_string!("Back"),
            &target,
            sel!(back:),
            nav_start_x + NAV_BUTTON_SPACING,
            mtm,
        );
        let forward = symbol_button(
            ns_string!("chevron.right"),
            ns_string!("Forward"),
            &target,
            sel!(forward:),
            nav_start_x + (NAV_BUTTON_SPACING * 2.0),
            mtm,
        );

        home.setFrameOrigin(NSPoint::new(nav_start_x, nav_y));
        back.setFrameOrigin(NSPoint::new(nav_start_x + NAV_BUTTON_SPACING, nav_y));
        forward.setFrameOrigin(NSPoint::new(
            nav_start_x + (NAV_BUTTON_SPACING * 2.0),
            nav_y,
        ));

        titlebar_container.addSubview(&home);
        titlebar_container.addSubview(&back);
        titlebar_container.addSubview(&forward);

        let _ = Retained::into_raw(target);
    }
}

#[cfg(target_os = "macos")]
pub use macos::install;

#[cfg(not(target_os = "macos"))]
pub fn install(_app: &tauri::AppHandle) {}
