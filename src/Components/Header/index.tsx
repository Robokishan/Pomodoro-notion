import { GITHUB_URL, PORTFOLIO_URL } from "@/utils/constants";
import { getAppVersion } from "@/utils/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import ContentLoader from "react-content-loader";
import { toast } from "react-toastify";
import useNotification from "../../hooks/useNotification";
import Dropdown, { MenuType } from "../Dropdown";
import ExportAsModal from "../ExportAsModal";
import NotionModifyModal from "../NotionModifyModal";

export default function Header({ imgSrc }: { imgSrc?: string }) {
  const { data: session, status: sessionStatus } = useSession();

  const [showNotionModal, setNotionModal] = useState(false);
  const [showExportAs, setExportAs] = useState(false);

  const [notify] = useNotification();

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
            setNotionModal(true);
          },
        },
      },
      {
        label: "Test Desktop Notification",
        value: "testdesktopnotification",
        component: {
          type: "button",
          onClick() {
            notify("Desktop Notification Works!", "Test").then(
              (b) =>
                b != true &&
                toast.warn(
                  "Please allow Desktop notification If you want to see Desktop notifications!" // desktop notification not allowed
                )
            );
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
        label: "Import Data (coming soon)",
        value: "importdata",
        component: {
          type: "button",
          onClick() {
            // dummy onClick
          },
        },
      },
      {
        label: "Export data (coming soon)", //data will be mailed modal open
        value: "exportdata",
        component: {
          type: "button",
          onClick() {
            // dummy onClick
          },
        },
      },
      {
        label: "Export data as", //export modal will open and we can export as csv , text or excel. this will not be backup data and data will be mailed modal open
        value: "exportas",
        component: {
          type: "button",
          onClick() {
            setExportAs(true);
          },
        },
      },
      {
        label: "About app",
        value: "aboutapp",
        component: {
          type: "link",
          href: "/about",
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
      {
        label: `version: ${getAppVersion()}`,
        style: "text-slate-500",
        value: "appversion",
        component: {
          type: "text",
        },
      },
    ],
    [session?.user?.email]
  );

  return (
    <div className="flex flex-row gap-10 sm:flex-row sm:justify-center">
      <h1 className="text-3xl font-extrabold leading-normal text-gray-700 md:text-[4rem]">
        <Link href="/">
          <a>
            Pomodoro <span className="text-purple-300">Databases</span> Notion
          </a>
        </Link>
      </h1>
      {/* show dropdown if user logged in */}
      {sessionStatus == "loading" ? (
        <div>
          <div className="hidden flex-col items-center justify-center sm:flex ">
            <ContentLoader
              className="bg-red-50"
              height={20}
              width={89}
              viewBox="0 0 89 20"
            >
              <rect x="0" y="0" width={89} height={20} />
            </ContentLoader>
          </div>
          <ContentLoader
            className="mt-2"
            height={50}
            width={50}
            viewBox="0 0 50 50"
          >
            <rect x="0" y="0" rx="5" ry="5" width="50" height="50" />
          </ContentLoader>
          <ContentLoader
            className="mt-2"
            height={30}
            width={30}
            viewBox="0 0 30 30"
          >
            <rect x="0" y="0" rx="100" ry="100" width="30" height="30" />
          </ContentLoader>
        </div>
      ) : (
        session && (
          <div>
            <div className="hidden flex-col items-center justify-center sm:flex ">
              {session.user && session?.user.name} <br />
            </div>
            <Image
              loading="lazy"
              src={imgSrc ?? session.user?.image ?? "https://picsum.photos/50"}
              alt="pic"
              width={50}
              height={50}
            />
            <div>
              <Dropdown menuList={menuList} />
            </div>
          </div>
        )
      )}
      {showNotionModal && <NotionModifyModal setModal={setNotionModal} />}
      {showExportAs && (
        <ExportAsModal modalIsOpen={showExportAs} setModal={setExportAs} />
      )}
    </div>
  );
}
