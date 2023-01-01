import { DatabaseList } from "../../../types/database/database.list";
import { DatabaseQuery } from "../../../types/database/databaseQuery";
import notionClient from "../notionServerClient";
import PomodoroClient from "../notionClient";
import { DatabaseDetail } from "../../../types/database/databaseDetail";

const BASE_DATABASE = "/v1/databases";

export const queryDatabase = async (
  id: string,
  serverSide = false,
  token = ""
): Promise<DatabaseQuery> => {
  const { data } = serverSide
    ? await notionClient.post(
        BASE_DATABASE + "/" + id + "/query",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
    : await PomodoroClient.post(BASE_DATABASE + "/" + id + "/query");
  return data;
};

export const retrieveDatabase = async (
  id: string,
  serverSide = false,
  token = ""
): Promise<DatabaseDetail> => {
  const { data } = serverSide
    ? await notionClient.get(BASE_DATABASE + "/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
    : await PomodoroClient.get(BASE_DATABASE + "/" + id);
  return data;
};

export const listDatabases = async (
  serverSide = false,
  token = ""
): Promise<DatabaseList> => {
  const { data } = serverSide
    ? await notionClient.get(BASE_DATABASE, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
    : await PomodoroClient.get(BASE_DATABASE);
  return data;
};
