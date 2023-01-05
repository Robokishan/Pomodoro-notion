import React, { useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { BASE_URL, GITHUB_URL, PORTFOLIO_URL } from "@/utils/constants";
import Dropdown, { MenuType } from "../Dropdown";
import NotionConnectModal from "../NotionModifyModal";

export default function Header({ imgSrc }: { imgSrc?: string }) {
  const { data: session } = useSession();

  const [showModal, setModal] = useState(false);

  const menuList: MenuType[] = useMemo(
    (): MenuType[] => [
      {
        label: session?.user?.email ?? "No email found",
        value: session?.user?.email ?? "noemail",
        component: {
          type: "button",
          onClick: () => {
            // dummy on click
          },
        },
      },
      {
        label: "Modify Notion Connection",
        value: "modifynotionsettings",
        component: {
          type: "button",
          onClick() {
            setModal(true);
          },
        },
      },
      {
        label: "How to ? (coming soon)",
        value: "how to",
        component: {
          type: "button",
          onClick() {
            // dummy onClick
          },
        },
      },
      {
        label: "About me",
        value: "aboutme",
        component: {
          type: "link",
          href: PORTFOLIO_URL,
        },
      },
      {
        label: "Github",
        value: "github",
        component: {
          type: "link",
          href: GITHUB_URL,
        },
      },
      {
        label: "Privacy Policy",
        value: "privacypolicy",
        component: {
          type: "link",
          href: "/privacy",
        },
      },
      {
        style: "text-red-600",
        label: "Sign out",
        value: "signout",
        component: {
          type: "button",
          onClick: () => {
            signOut();
          },
        },
      },
    ],
    [session?.user?.email]
  );

  return (
    <div className="flex flex-col gap-10 sm:flex-row sm:justify-center">
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[4rem]">
        <a href={BASE_URL}>
          Pomodoro <span className="text-purple-300">Databases</span> Notion
        </a>
      </h1>
      {session && (
        <div className="flex flex-col items-center md:block ">
          <div className="flex flex-col items-center justify-center ">
            {session.user && session?.user.name} <br />
          </div>
          <Image
            loading="lazy"
            src={imgSrc ?? "https://picsum.photos/50"}
            alt="pic"
            width={50}
            height={50}
          />
          <div>
            <Dropdown menuList={menuList} />
          </div>
        </div>
      )}
      {showModal && <NotionConnectModal setModal={setModal} />}
    </div>
  );
}
