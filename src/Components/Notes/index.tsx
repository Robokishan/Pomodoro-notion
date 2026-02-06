import { usePomoState } from "@/utils/Context/PomoContext/Context";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawProps } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import {
  ArrowUpIcon,
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentLoader from "react-content-loader";
import { useNote } from "../../hooks/useNote";
import { useTheme } from "../../utils/Context/ThemeContext";
import Switch from "../Switch";

const Excalidraw = dynamic<ExcalidrawProps>(
  () => import("@excalidraw/excalidraw").then((comp) => comp.Excalidraw),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

export default function Notes() {
  const [{ project, databaseId }] = usePomoState();
  const [noteId, initialData, updateNote, , loading, isPublic, makePublic] =
    useNote(project?.value, databaseId);
  const [inViewPort, setInView] = useState(false);
  const [copied, setCopied] = useState(false);
  const prevCheckedRef = useRef(false);
  const { resolvedTheme } = useTheme();

  const isPublicLoading = isPublic === "loading";
  if (!isPublicLoading) {
    prevCheckedRef.current = isPublic === "public";
  }
  const switchChecked = isPublicLoading
    ? prevCheckedRef.current
    : isPublic === "public";

  function handleScroll(): boolean {
    const myElement = document.getElementById("excalidraw-wrapper");
    if (myElement) {
      const bounding = myElement.getBoundingClientRect();
      if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
      ) {
        setInView(true);
        return true;
      } else {
        setInView(false);
        return false;
      }
    }
    return false;
  }

  function scroll() {
    const myElement = document.getElementById("excalidraw-wrapper");
    if (myElement) {
      const bounding = myElement.getBoundingClientRect();
      if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
      ) {
        window.scrollTo(0, 0);
      } else {
        myElement.scrollIntoView();
      }
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {loading == "done" && project?.value ? (
        <div className={"mx-auto mt-2"}>
          <div className="mr-4 flex flex-row-reverse gap-6">
            <div>
              <Switch
                loading={isPublicLoading}
                checked={switchChecked}
                onChange={(e) =>
                  databaseId &&
                  makePublic({
                    projectId: project.value,
                    databaseId,
                    shouldPublic: e.target.checked,
                  })
                }
                text="Public"
              />
            </div>
            {isPublic === "public" && (
              <div>
                <CopyToClipboard
                  text={`${window.location.origin}/public/note/${noteId}`}
                  onCopy={() => setCopied(true)}
                >
                  {copied === false ? (
                    <ClipboardIcon className="h-6 w-5 cursor-pointer text-icon" />
                  ) : (
                    <ClipboardDocumentCheckIcon className="h-6 w-5 cursor-pointer text-icon" />
                  )}
                </CopyToClipboard>
              </div>
            )}
          </div>
          <div
            id="excalidraw-wrapper"
            className={"mx-auto mt-2 h-screen border border-theme"}
          >
            <Excalidraw
              theme={isDark ? "dark" : "light"}
              renderTopRightUI={() => {
                return (
                  <button
                    onClick={scroll}
                    className="flex h-8 w-8 items-center justify-center rounded border border-theme text-heading"
                  >
                    {inViewPort == true ? (
                      <ArrowUpIcon className="h-5 w-5" />
                    ) : (
                      <ArrowDownIcon className="h-5 w-5" />
                    )}
                  </button>
                );
              }}
              onChange={(elements) => {
                updateNote(elements as ExcalidrawElement[]);
              }}
              initialData={{
                elements: initialData ?? [],
                scrollToContent: true,
                appState: {
                  theme: isDark ? "dark" : "light",
                },
              }}
            />
          </div>
        </div>
      ) : project?.value ? (
        <div className="mx-auto mt-2">
          <ContentLoader
            width="100%"
            height={500}
            viewBox="0 0 800 500"
            backgroundColor={isDark ? "#374151" : "#e0e0e0"}
            foregroundColor={isDark ? "#4b5563" : "#f5f5f5"}
          >
            {/* Toolbar row */}
            <rect x="0" y="0" rx="5" ry="5" width="60" height="32" />
            <rect x="70" y="0" rx="5" ry="5" width="60" height="32" />
            <rect x="680" y="0" rx="5" ry="5" width="110" height="32" />
            {/* Canvas area */}
            <rect x="0" y="48" rx="8" ry="8" width="800" height="440" />
          </ContentLoader>
        </div>
      ) : (
        <div className="mt-10 flex w-full justify-center">
          <span className="text-muted">Select Project to get started</span>
        </div>
      )}
    </>
  );
}
