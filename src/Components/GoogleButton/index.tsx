import React, { useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import Router from "next/router";
import { isDesktopRuntime } from "../../utils/desktop/isDesktopRuntime";
import { DesktopAuthSuccessPayload } from "../../types/tauri-global";

export default function GoogleButton() {
  useEffect(() => {
    if (!isDesktopRuntime()) return;

    let unlisten: (() => void) | undefined;

    window.__TAURI__?.event
      ?.listen<DesktopAuthSuccessPayload>("auth-success", async ({ payload }) => {
        const response = await fetch("/api/desktop/auth/google-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: payload.id_token,
          }),
        });

        if (!response.ok) {
          throw new Error("Could not create desktop session");
        }

        window.location.assign("/");
      })
      .then((listener) => {
        unlisten = listener;
      });

    return () => {
      unlisten?.();
    };
  }, []);

  async function handleGoogleSignIn() {
    if (isDesktopRuntime()) {
      await window.__TAURI__?.core?.invoke("start_google_sign_in");
      return;
    }

    signIn("google", { callbackUrl: "/" });
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="mt-3 
    rounded-sm
      bg-blue-500 
       font-semibold text-white shadow-xl hover:bg-blue-600 "
    >
      <div className="flex items-center ">
        <div className="m-[1px] flex items-center justify-center rounded-sm bg-slate-50 p-[10px]">
          <Image
            className=""
            alt="googleImage"
            width={20}
            height={20}
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          />
        </div>
        <div className="flex items-center self-stretch   px-3 text-sm text-white">
          Sign in with google
        </div>
      </div>
    </button>
  );
}
