import { GITHUB_URL, PORTFOLIO_URL } from "@/utils/constants";
import { getAppVersion } from "@/utils/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import ContentLoader from "react-content-loader";
import { toast } from "react-toastify";
import useNotification from "../../hooks/useNotification";
import { useTheme } from "../../utils/Context/ThemeContext";
import Dropdown, { MenuType } from "../Dropdown";
import NotionConnectModal from "../NotionModifyModal";
import ThemeSwitcher from "../ThemeSwitcher";

export default function Header({ imgSrc }: { imgSrc?: string }) {
  const { data: session, status: sessionStatus } = useSession();
  const [showModal, setModal] = useState(false);
  const [notify] = useNotification();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const skeletonBg = isDark ? "#374151" : "#e0e0e0";
  const skeletonFg = isDark ? "#4b5563" : "#f5f5f5";

  const menuList: MenuType[] = useMemo(
    (): MenuType[] => [
      {
        label: session?.user?.email ?? "No email found",
        value: session?.user?.email ?? "noemail",
        component: { type: "button", onClick: () => {} },
      },
      {
        label: "Modify Notion Connection",
        value: "modifynotionsettings",
        component: { type: "button", onClick() { setModal(true); } },
      },
      {
        label: "Theme",
        value: "theme",
        component: {
          type: "custom",
          render: () => (
            <div className="border-t border-theme">
              <span className="block px-4 pt-2 text-xs font-medium text-faint">
                Theme
              </span>
              <ThemeSwitcher />
            </div>
          ),
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
                  "Please allow Desktop notification If you want to see Desktop notifications!"
                )
            );
          },
        },
      },
      {
        label: "How to ? (coming soon)",
        value: "how to",
        component: { type: "button", onClick() {} },
      },
      {
        label: "Import Data (coming soon)",
        value: "importdata",
        component: { type: "button", onClick() {} },
      },
      {
        label: "Export data (coming soon)",
        value: "exportdata",
        component: { type: "button", onClick() {} },
      },
      {
        label: "Export data as (coming soon)",
        value: "exportasexcel",
        component: { type: "button", onClick() {} },
      },
      {
        label: "About app",
        value: "aboutapp",
        component: { type: "link", href: "/about" },
      },
      {
        label: "About me",
        value: "aboutme",
        component: { type: "link", href: PORTFOLIO_URL },
      },
      {
        label: "Github",
        value: "github",
        component: { type: "link", href: GITHUB_URL },
      },
      {
        label: "Privacy Policy",
        value: "privacypolicy",
        component: { type: "link", href: "/privacy" },
      },
      {
        style: "text-red-600",
        label: "Sign out",
        value: "signout",
        component: { type: "button", onClick: () => { signOut(); } },
      },
      {
        label: `version: ${getAppVersion()}`,
        style: "text-slate-500",
        value: "appversion",
        component: { type: "text" },
      },
    ],
    [session?.user?.email]
  );

  return (
    <div className="flex flex-row gap-10 sm:flex-row sm:justify-center">
      <h1 className="text-3xl font-extrabold leading-normal text-heading md:text-[4rem]">
        <Link href="/">
            Pomodoro <span className="text-purple-300">Databases</span> Notion
        </Link>
      </h1>
      {sessionStatus == "loading" ? (
        <div>
          <div className="hidden flex-col items-center justify-center sm:flex ">
            <ContentLoader
              className="bg-surface-muted"
              height={20} width={89} viewBox="0 0 89 20"
              backgroundColor={skeletonBg} foregroundColor={skeletonFg}
            >
              <rect x="0" y="0" width={89} height={20} />
            </ContentLoader>
          </div>
          <ContentLoader
            className="mt-2" height={50} width={50} viewBox="0 0 50 50"
            backgroundColor={skeletonBg} foregroundColor={skeletonFg}
          >
            <rect x="0" y="0" rx="5" ry="5" width="50" height="50" />
          </ContentLoader>
          <ContentLoader
            className="mt-2" height={30} width={30} viewBox="0 0 30 30"
            backgroundColor={skeletonBg} foregroundColor={skeletonFg}
          >
            <rect x="0" y="0" rx="100" ry="100" width="30" height="30" />
          </ContentLoader>
        </div>
      ) : (
        session && (
          <div>
            <div className="hidden flex-col items-center justify-center text-heading sm:flex">
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
      {showModal && <NotionConnectModal setModal={setModal} />}
    </div>
  );
}
