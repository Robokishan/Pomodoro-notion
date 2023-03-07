import { useUserState } from "@/utils/Context/UserContext/Context";
import { getNote, pushNote } from "@/utils/noteAPI";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";


type Loader = "initial" | "loading" | "done"

export const useNote = <N>(
    projectId?: string,
    databaseId?: string
): Return<ExcalidrawElement[]> => {
    const [{ userId }] = useUserState();
    const [loading, setLoading] = useState<Loader>("initial");
    const [note, setNote] = useState<ExcalidrawElement[] | null>(null);
    const [noteId, setNoteId] = useState<string | null>(null);

    function resetData() {
        setNote(null)
        setNoteId(null)
    }

    const mutate = useCallback(async () => {
        if (projectId && databaseId && userId) {
            try {
                setLoading("loading");
                resetData()
                const note = await getNote<N>({
                    databaseId,
                    projectId,
                    userId,
                });
                if ((note as any)?.noteData) {
                    setNote(JSON.parse((note as any)?.noteData))
                    setNoteId((note as any).noteId as string)
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

    const addNote = useCallback(async (
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
            noteId
        });
        if (!noteId)
            setNoteId(data.id)
    }, [userId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (projectId && databaseId && note)
                addNote(projectId, databaseId, note.filter(n => !n.isDeleted), noteId)
        }, 1500)
        return () => clearTimeout(timer)
    }, [note, projectId, databaseId, addNote, noteId])

    return [note, setNote, addNote, loading];
};

type Return<S> = [
    S | null,
    Dispatch<SetStateAction<S | null>>,
    (
        projectId: string,
        databaseId: string,
        noteData: unknown,
        noteId: string
    ) => Promise<void>,
    Loader
];