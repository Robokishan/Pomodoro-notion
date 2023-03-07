import { db } from "../../../firebaseutils";
import {
    collection,
    addDoc,
    where,
    getDocs,
    query,
    doc,
    deleteDoc,
    orderBy,
    setDoc,
} from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "../constants";
import { serverTimestamp } from "firebase/firestore";
import { NoteMeta } from "./type";


// add pagination here
export const getNotes = async (
    userId: string,
) => {
    const querySnapshot = await getDocs(
        query(
            collection(db, FIREBASE_COLLECTIONS.NOTES),
            where("userId", "==", userId),
            orderBy("createdAt"),
        )
    );
    const notes = querySnapshot.docs.map((d) => ({
        ...d.data(),
        noteId: d.id,
    }));
    return notes;
};

export const getNote = async (
    { userId, projectId, databaseId }:
        NoteMeta
) => {
    const querySnapshot = await getDocs(
        query(
            collection(db, FIREBASE_COLLECTIONS.NOTES),
            where("userId", "==", userId),
            where("projectId", "==", projectId),
            where("databaseId", "==", databaseId),
        )
    );
    const notes = querySnapshot.docs.map((d) => ({
        ...d.data(),
        noteId: d.id,
    }));
    return notes;
};

// add id here
export const getNoteById = async (
    { userId, projectId, databaseId }:
        NoteMeta & { noteId: string }
) => {
    const querySnapshot = await getDocs(
        query(
            collection(db, FIREBASE_COLLECTIONS.NOTES),
            where("userId", "==", userId),
            where("projectId", "==", projectId),
            where("databaseId", "==", databaseId)
        )
    );
    const notes = querySnapshot.docs.map((d) => ({
        ...d.data(),
        noteId: d.id,
    }));
    return notes[0] ?? {};
};


export const upsertNote = async ({
    projectId,
    databaseId,
    userId,
    noteData,
    noteId
}: NoteMeta & { noteData: Partial<unknown>, noteId?: string }) => {
    const noteDataWithMeta = {
        projectId,
        databaseId,
        userId,
        noteData: JSON.stringify(noteData),
    }
    if (noteId) {
        await setDoc(doc(db, FIREBASE_COLLECTIONS.NOTES, noteId), {
            ...noteDataWithMeta,
            modifiedAt: serverTimestamp()
        }, { merge: true });
        return noteId
    } else {
        const tid = await addDoc(collection(db, FIREBASE_COLLECTIONS.NOTES), {
            ...noteDataWithMeta, createdAt:
                serverTimestamp(),
            modifiedAt: serverTimestamp()
        });
        return tid.id;
    }

};

export const deleteNote = async ({
    userId,
    projectId,
    databaseId,
    noteId,
}: NoteMeta & { noteId: string }) => {
    if (!getNoteById({ userId, databaseId, projectId, noteId }))
        throw new Error("No timesheet found");
    await deleteDoc(doc(db, FIREBASE_COLLECTIONS.NOTES, noteId));
};
