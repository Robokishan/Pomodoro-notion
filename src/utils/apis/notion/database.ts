import { DatabaseList } from "../../types/database/database.list";
import { DatabaseQuery } from "../../types/database/databaseQuery";
import notionClient from "../notionServerClient";
import PomodoroClient from "../notionClient";

const BASE_DATABASE = "/v1/databases";

export const queryDatabase = async (
  id: string,
  serverSide = false
): Promise<DatabaseQuery> => {
  const { data } = serverSide
    ? await notionClient.post(BASE_DATABASE + "/" + id + "/query")
    : await PomodoroClient.post(BASE_DATABASE + "/" + id + "/query");
  return data;
};

export const retrieveDatabase = async (
  id: string,
  serverSide = false
): Promise<any> => {
  const { data } = serverSide
    ? await notionClient.get(BASE_DATABASE + "/" + id)
    : await PomodoroClient.get(BASE_DATABASE + "/" + id);
  return data;
};

export const listDatabases = async (
  serverSide = false
): Promise<DatabaseList> => {
  const { data } = serverSide
    ? await notionClient.get(BASE_DATABASE)
    : await PomodoroClient.get(BASE_DATABASE);
  return data;
};
