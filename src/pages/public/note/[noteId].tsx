import { getPublicNoteData } from "@/utils/apis/firebase/notes";
import { useTheme } from "@/utils/Context/ThemeContext";
import dynamic from "next/dynamic";
import type { ExcalidrawProps } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
const Excalidraw = dynamic<ExcalidrawProps>(
  () => import("@excalidraw/excalidraw").then((comp) => comp.Excalidraw),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  try {
    const noteId = query.noteId as string;
    if (!noteId) throw new Error("Something went wrong");
    const noteData = await getPublicNoteData({ noteId });
    return {
      props: {
        noteData,
      },
    };
  } catch (error) {
    return {
      props: {
        error: (error as any).message ?? "Something went wrong",
      },
    };
  }
};

export default function Note({
  noteData,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      {noteData ? (
        <div id="excalidraw-wrapper" className="h-[100dvh] w-full">
          <Excalidraw
            theme={isDark ? "dark" : "light"}
            zenModeEnabled={true}
            viewModeEnabled={true}
            initialData={{
              elements: JSON.parse(noteData ?? "[]"),
              scrollToContent: true,
              appState: {
                theme: isDark ? "dark" : "light",
              },
            }}
          />
        </div>
      ) : error ? (
        <div className="text-muted">{error}</div>
      ) : (
        <div className="text-muted">If you are seeing this contact developer</div>
      )}
    </>
  );
}
