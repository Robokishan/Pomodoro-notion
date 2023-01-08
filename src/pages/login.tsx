/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Footer from "../Components/Footer";
import About from "../Components/About";

export default function Login() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          {" "}
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
            <section className="mt-10">
              <Footer />
            </section>
          </div>{" "}
        </>
      ) : (
        <About />
      )}
    </>
  );
}
