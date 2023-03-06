import dynamic from "next/dynamic";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";
import { useLocalStorage } from "../../hooks/Storage/useLocalStorage";
import { usePomoState } from "@/utils/Context/PomoContext/Context";

const Excalidraw = dynamic<ExcalidrawProps>(
  () => import("@excalidraw/excalidraw").then((comp) => comp.Excalidraw),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

export default function Notes() {
  const [{ project }] = usePomoState();
  const [initialData, setInitialData] = useLocalStorage<ExcalidrawElement[]>(project?.value ?? undefined, []);

  return (
    <>
      {initialData ?
        <div className="mx-auto mt-10 h-screen border">
          <Excalidraw
            onChange={(elements) => {
              setInitialData(elements as any)
            }}
            initialData={{
              elements: initialData ?? [],
              scrollToContent: true
            }}
          />
        </div>
        : <div className="flex w-full mt-10 justify-center"><span>Select Project to get started</span></div>}
    </>
  );
}
