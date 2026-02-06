import { useUserState } from "@/utils/Context/UserContext/Context";
import { getNote, markPublic, pushNote } from "@/utils/noteAPI";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

type Loader = "initial" | "loading" | "done";
type isPublic = "public" | "loading" | "notPublic";

export const useNote = <N>(
  projectId?: string,
  databaseId?: string
): Return<ExcalidrawElement[]> => {
  const [{ userId }] = useUserState();
  const [loading, setLoading] = useState<Loader>("initial");
  const [note, setNote] = useState<ExcalidrawElement[] | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);

  const [isPublic, setPublic] = useState<isPublic>("loading");

  function resetData() {
    setNote(null);
    setNoteId(null);
  }

  const mutate = useCallback(async () => {
    if (projectId && databaseId && userId) {
      try {
        setLoading("loading");
        resetData();
        const note = await getNote<N>({
          databaseId,
          projectId,
          userId,
        });
        if ((note as any)?.noteData) {
          setNote(JSON.parse((note as any)?.noteData));
          setNoteId((note as any).noteId as string);
          updatePublicState((note as any)?.isPublic);
        }
      } catch (e) {
        console.error("ResponseError", e);
      } finally {
        setLoading("done");
      }
    }
  }, [userId, databaseId, projectId]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  const addNote = useCallback(
    async (
      projectId: string,
      databaseId: string,
      noteData: unknown,
      noteId?: string | null
    ) => {
      const data = await pushNote({
        projectId,
        databaseId,
        userId,
        noteData,
        noteId,
      });
      if (!noteId) setNoteId(data.id);
    },
    [userId]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectId && databaseId && note)
        addNote(
          projectId,
          databaseId,
          note.filter((n) => !n.isDeleted),
          noteId
        );
    }, 1500);
    return () => clearTimeout(timer);
  }, [note, projectId, databaseId, addNote, noteId]);

  const publicChanger = async ({
    shouldPublic,
    projectId,
    databaseId,
  }: {
    shouldPublic: boolean;
    projectId: string;
    databaseId: string;
  }) => {
    const prev = isPublic;
    try {
      setPublic("loading");
      const data = await markPublic({
        projectId,
        databaseId,
        userId,
        shouldPublic,
        noteId,
      });
      updatePublicState(data.isPublic);
    } catch (error) {
      console.error(error);
      setPublic(prev);
    }
  };

  const updatePublicState = (isPublic: boolean) =>
    setPublic(isPublic === true ? "public" : "notPublic");

  return [noteId, note, setNote, addNote, loading, isPublic, publicChanger];
};

type Return<S> = [
  string | null,
  S | null,
  Dispatch<SetStateAction<S | null>>,
  (
    projectId: string,
    databaseId: string,
    noteData: unknown,
    noteId: string
  ) => Promise<void>,
  Loader,
  isPublic,
  ({
    projectId,
    databaseId,
    shouldPublic,
  }: {
    projectId: string;
    databaseId: string;
    shouldPublic: boolean;
  }) => Promise<any>
];
