import { db } from "../../firebase";
import { collection, addDoc, where, getDocs, query } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "./constants";
import { generateUUID } from "../../utils";
import { serverTimestamp } from "firebase/firestore";

export const getTimesheets = async (userId: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.TIMESHEET),
      where("userId", "==", userId)
    )
  );
  const timesheets = querySnapshot.docs.map((d) => d.data());
  return timesheets;
};

export const insertTimesheet = async ({
  projectId,
  userId,
  timerValue,
}: {
  projectId: string;
  userId: string;
  timerValue: number;
}) => {
  const tid = generateUUID();
  await addDoc(collection(db, FIREBASE_COLLECTIONS.TIMESHEET), {
    projectId,
    userId,
    timerValue,
    timesheetId: tid,
    createdAt: serverTimestamp(),
  });
  return tid;
};
