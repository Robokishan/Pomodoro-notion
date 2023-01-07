import React from "react";
import { useSession, signOut } from "next-auth/react";
import Footer from "../Components/Footer";
import GoogleButton from "../Components/GoogleButton";
import Link from "next/link";

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
        <>
          <div className="flex flex-col items-center justify-center px-5 pb-5 ">
            <h1 className="my-5 flex flex-col items-center gap-5 text-4xl font-extrabold leading-normal text-gray-700 md:flex-row">
              <Link href="/">
                <a>
                  Pomodoro <span className="text-purple-300">for </span> Notion
                  Database
                </a>
              </Link>
              <GoogleButton />
            </h1>

            <section className="container flex flex-col gap-6 text-slate-700">
              <h1 className="text-4xl font-bold	">
                An online Pomodoro Timer to boost your productivity
              </h1>
              <section>
                <h3 className="text-2xl font-semibold">
                  What is Pomodoro by Kishan Joshi ?
                </h3>
                <p className="mt-2">
                  Pomodoro is a customizable pomodoro timer that works on
                  desktop & mobile browser. The aim of this app is to help you
                  focus on your notions database tasks you are working on, such
                  as uploading youtube video, writing script, or coding a
                  webpage. This app is inspired by Pomodoro Technique which is a
                  time management method developed by Francesco Cirillo.
                </p>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">
                  What is Pomodoro Technique ?
                </h3>
                <p className="mt-2">
                  The Pomodoro Technique is created by Francesco Cirillo for a
                  more productive way to work and study. The technique uses a
                  timer to break down work into intervals, traditionally 25
                  minutes in length, separated by short breaks. Each interval is
                  known as a pomodoro, from the Italian word for 'tomato', after
                  the tomato-shaped kitchen timer that Cirillo used as a
                  university student. - Wikipedia
                </p>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">
                  How to use the Pomodoro Timer ?
                </h3>
                <ul className="mt-2 list-disc px-5">
                  <li>Sign in to App</li>
                  <li>
                    Add <b>Notion database</b> using Add notion button or modify
                    notion button{" "}
                  </li>
                  <li>Select Proect from select menu</li>
                  <li>Start pomodoro timer</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Features</h3>
                <ul className="mt-2 list-decimal px-5">
                  <li>Responsive design that works with desktop and mobile</li>
                  <li>Noises to stay productive</li>
                  <li>Analytics charts</li>
                  <li>Timesheets</li>
                  <li>Build for notion databases</li>
                </ul>
              </section>
            </section>
            <section className="mt-10">
              <Footer />
            </section>
          </div>
        </>
      )}
    </>
  );
}
