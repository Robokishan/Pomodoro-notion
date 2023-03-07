import { usePomoState } from "@/utils/Context/PomoContext/Context";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";
import {
  ArrowSmallUpIcon,
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNote } from "../../hooks/useNote";
import Portal from "../Portal";
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

  return (
    <Portal element="note">
      <>
        {loading == "done" && project?.value ? (
          <div className={"mx-auto mt-2"}>
            <div className="mr-4 flex flex-row-reverse gap-6">
              <div>
                <Switch
                  disabled={isPublic === "loading"}
                  checked={isPublic == "public" ? true : false}
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
                      <ClipboardIcon className="h-6 w-5 cursor-pointer" />
                    ) : (
                      <ClipboardDocumentCheckIcon className="h-6 w-5 cursor-pointer" />
                    )}
                  </CopyToClipboard>
                </div>
              )}
            </div>
            <div
              id="excalidraw-wrapper"
              className={"mx-auto mt-2 h-screen border"}
            >
              <Excalidraw
                renderTopRightUI={() => {
                  return (
                    <button
                      onClick={scroll}
                      className="flex h-8 w-8 items-center justify-center rounded border"
                    >
                      {inViewPort == true ? (
                        <ArrowSmallUpIcon className="h-5 w-5" />
                      ) : (
                        <ArrowSmallDownIcon className="h-5 w-5" />
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
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-10 flex w-full justify-center">
            <span>Select Project to get started</span>
          </div>
        )}
      </>
    </Portal>
  );
}
