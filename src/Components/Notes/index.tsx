import { usePomoState } from "@/utils/Context/PomoContext/Context";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";
import {
  ArrowSmallUpIcon
} from "@heroicons/react/24/outline";
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useNote } from "../../hooks/useNote";
import Portal from "../Portal";

const Excalidraw = dynamic<ExcalidrawProps>(
  () => import("@excalidraw/excalidraw").then((comp) => comp.Excalidraw),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

export default function Notes() {


  const [{ project, databaseId }] = usePomoState();
  const [initialData, updateNote, , loading] = useNote(project?.value, databaseId);

  const [inViewPort, setInView] = useState(false);


  function handleScroll(): boolean {
    const myElement = document.getElementById('excalidraw-wrapper');
    if (myElement) {
      const bounding = myElement.getBoundingClientRect();
      if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        setInView(true)
        return true
      } else {
        setInView(false)
        return false
      }
    }
    return false
  }

  function scroll() {
    const myElement = document.getElementById('excalidraw-wrapper');
    if (myElement) {
      const bounding = myElement.getBoundingClientRect();
      if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        window.scrollTo(0, 0)
      } else {
        myElement.scrollIntoView()
      }
    }

  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <Portal element="note">
    <>
      {loading == "done" && project?.value ?
        <div id="excalidraw-wrapper" className={'mx-auto mt-10 h-screen border'} >
          <Excalidraw
            renderTopRightUI={() => {
              return (
                <button onClick={scroll} className="h-8 w-8 border flex justify-center items-center rounded">
                  {
                    inViewPort == true ? <ArrowSmallUpIcon className="h-5 w-5" /> : <ArrowSmallDownIcon className="h-5 w-5" />
                  }
                </button>
              );
            }}
            onChange={(elements) => {
              updateNote(elements as ExcalidrawElement[])
            }}
            initialData={{
              elements: initialData ?? [],
              scrollToContent: true
            }}
          />

        </div>
        : <div className="flex w-full mt-10 justify-center"><span>Select Project to get started</span></div>
      }
    </>
  </Portal>
}
