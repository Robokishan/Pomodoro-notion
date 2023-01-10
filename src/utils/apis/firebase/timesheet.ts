import { db } from "../../firebaseutils";
import {
  collection,
  addDoc,
  where,
  getDocs,
  query,
  doc,
  deleteDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "./constants";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export const getTimesheets = async (
  userId: string,
  { startDate, endDate }: { startDate: number; endDate: number }
) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.TIMESHEET),
      where("userId", "==", userId),
      where("createdAt", ">", new Date(startDate * 1000)),
      where("createdAt", "<", new Date(endDate * 1000)),
      orderBy("createdAt")
    )
  );
  const timesheets = querySnapshot.docs.map((d) => ({
    ...d.data(),
    timesheetId: d.id,
  }));
  return timesheets;
};

export const getDatabaseTimesheetsByEmail = async (
  email: string,
  databaseId: string,
  { startDate, endDate }: { startDate: number; endDate: number }
) => {
  const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, email));
  if (!userDoc.exists()) return null;
  const user = userDoc.data();
  const timesheetSnapShot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.TIMESHEET),
      where("userId", "==", user.id),
      where("databaseId", "==", databaseId),
      where("createdAt", ">", new Date(startDate * 1000)),
      where("createdAt", "<", new Date(endDate * 1000)),
      orderBy("createdAt")
    )
  );

  const timesheets = timesheetSnapShot.docs.map((d) => ({
    ...d.data(),
    timesheetId: d.id,
  }));
  return timesheets;
};

export const getDatabaseTimesheetsById = async (
  userId: string,
  databaseId: string,
  { startDate, endDate }: { startDate: number; endDate: number }
): Promise<any> => {
  const timesheetSnapShot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.TIMESHEET),
      where("userId", "==", userId),
      where("databaseId", "==", databaseId),
      where("createdAt", ">", new Date(startDate * 1000)),
      where("createdAt", "<", new Date(endDate * 1000)),
      orderBy("createdAt")
    )
  );

  const timesheets = timesheetSnapShot.docs.map((d) => ({
    ...d.data(),
    timesheetId: d.id,
  }));
  return timesheets;
};

export const getTimesheet = async (
  userId: string,
  projectId: string,
  { startDate, endDate }: { startDate: number; endDate: number }
) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.TIMESHEET),
      where("userId", "==", userId),
      where("projectId", "==", projectId),
      where("createdAt", ">", new Date(startDate * 1000)),
      where("createdAt", "<", new Date(endDate * 1000))
    )
  );
  const timesheets = querySnapshot.docs.map((d) => ({
    ...d.data(),
    timesheetId: d.id,
  }));
  return timesheets;
};

export const getTimesheetById = async (
  userId: string,
  projectId: string,
  timesheetId: string
) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.TIMESHEET),
      where("userId", "==", userId),
      where("projectId", "==", projectId),
      where("timesheetId", "==", timesheetId)
    )
  );
  const timesheets = querySnapshot.docs.map((d) => ({
    ...d.data(),
    timesheetId: d.id,
  }));
  return timesheets;
};

export const insertTimesheet = async ({
  projectId,
  databaseId,
  userId,
  timerValue,
  startTime,
  endTime,
}: {
  projectId: string;
  databaseId: string;
  userId: string;
  timerValue: number;
  startTime: number;
  endTime?: number;
}) => {
  const tid = await addDoc(collection(db, FIREBASE_COLLECTIONS.TIMESHEET), {
    projectId,
    databaseId,
    userId,
    timerValue,
    startTime,
    createdAt: endTime
      ? Timestamp.fromDate(new Date(endTime * 1000))
      : serverTimestamp(),
  });
  return tid.id;
};

export const deleteTimesheet = async ({
  userId,
  projectId,
  timesheetId,
}: {
  userId: string;
  projectId: string;
  timesheetId: string;
}) => {
  if (!getTimesheetById(userId, projectId, timesheetId))
    throw new Error("No timesheet found");
  await deleteDoc(doc(db, FIREBASE_COLLECTIONS.TIMESHEET, timesheetId));
};
