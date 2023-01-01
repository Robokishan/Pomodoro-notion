import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center ">
          Signed in as {session?.user?.email} <br />
          <button
            onClick={() => signOut()}
            className="mt-3 block 
                rounded-lg bg-gray-800 px-6 py-3
                text-lg font-semibold text-white shadow-xl hover:bg-black hover:text-white"
          >
            Sign out
          </button>
        </div>
      </>
    );
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center ">
      <button
        onClick={() => signIn()}
        className="mt-3 block 
                rounded-lg bg-gray-800 px-6 py-3
                text-lg font-semibold text-white shadow-xl hover:bg-black hover:text-white"
      >
        Login
      </button>
    </div>
  );
}
