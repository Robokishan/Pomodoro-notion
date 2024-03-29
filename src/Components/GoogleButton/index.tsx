import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <button
      onClick={() => signIn("google")}
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
