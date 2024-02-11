import { getPublicNoteData } from "@/utils/apis/firebase/notes";
import dynamic from "next/dynamic";
import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";
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
  return (
    <>
      {noteData ? (
        <div id="excalidraw-wrapper" className={"h-screen border"}>
          <Excalidraw
            zenModeEnabled={true}
            viewModeEnabled={true}
            initialData={{
              elements: JSON.parse(noteData ?? "[]"),
              scrollToContent: true,
            }}
          />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>If you are seeing this contact developer</div>
      )}
    </>
  );
}
