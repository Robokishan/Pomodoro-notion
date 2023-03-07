import { POMO_TSH_APIS } from "../apis/firebase/constants";
import PomodoroClient from "../apis/PomoCSR";

export const pushNote = async ({
  projectId,
  databaseId,
  userId,
  noteData,
  noteId,
}: {
  projectId: string;
  databaseId: string;
  userId: string;
  noteData: unknown;
  noteId?: string | null;
}) => {
  const { data } = await PomodoroClient.post(
    POMO_TSH_APIS.NOTE,
    {
      projectId,
      databaseId,
      noteData,
      noteId,
    },
    {
      params: {
        userId,
      },
    }
  );
  return data;
};

export const markPublic = async ({
  projectId,
  databaseId,
  userId,
  noteId,
  shouldPublic,
}: {
  projectId: string;
  databaseId: string;
  userId: string;
  noteId?: string | null;
  shouldPublic: boolean;
}) => {
  const { data } = await PomodoroClient.put(
    POMO_TSH_APIS.NOTE_PUBLIC,
    {
      projectId,
      databaseId,
      noteId,
      shouldPublic,
    },
    {
      params: {
        userId,
      },
    }
  );
  return data;
};

// get all timesheets for current user
export const getNote = async <N>({
  databaseId,
  projectId,
  userId,
}: {
  databaseId: string;
  projectId: string;
  userId: string;
}): Promise<N> => {
  const { data } = await PomodoroClient.get(POMO_TSH_APIS.NOTE, {
    params: {
      userId,
      databaseId,
      projectId,
    },
  });
  return data;
};

// TODO: get all timesheets for current user

export const deleteNote = async ({
  projectId,
  userId,
  databaseId,
  noteId,
}: {
  projectId: string;
  userId: string;
  databaseId: string;
  noteId: string;
}) => {
  await PomodoroClient.delete(POMO_TSH_APIS.TIMESHEET, {
    params: {
      projectId,
      userId,
      databaseId,
      noteId,
    },
  });
};
