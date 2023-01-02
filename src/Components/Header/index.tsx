import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header({ imgSrc }: { imgSrc?: string }) {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col gap-10 sm:flex-row sm:justify-center">
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[4rem]">
        Pomodoro <span className="text-purple-300">Databases</span> Notion
      </h1>
      {session && (
        <div className="flex flex-col items-center md:block ">
          <div className="flex flex-col items-center justify-center ">
            {session.user && session?.user.email} <br />
          </div>
          <Image
            loading="lazy"
            src={imgSrc ?? "https://picsum.photos/50"}
            alt="pic"
            width={50}
            height={50}
          />
          <button
            onClick={() => signOut()}
            className="mt-3 block 
                rounded-lg bg-gray-800 px-3 py-2
                text-sm font-semibold text-white shadow-xl hover:bg-black hover:text-white"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
