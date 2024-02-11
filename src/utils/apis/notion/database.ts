import { DatabaseList } from "../../../types/database/database.list";
import { DatabaseQuery } from "../../../types/database/databaseQuery";
import notionClient from "../notionServerClient";
import NotionClient from "../notionCSR";
import { DatabaseDetail } from "../../../types/database/databaseDetail";

const BASE_DATABASE = "/v1/databases";

export const queryDatabase = async (
  id: string,
  serverSide = false,
  token = ""
): Promise<DatabaseQuery> => {
  return await fetchDatabasePages(id, serverSide, token);
};

const fetchDatabasePages = async (
  id: string,
  serverSide = false,
  token = "",
  next_cursor: string | undefined = undefined
): Promise<DatabaseQuery> => {
  const { data } = serverSide
    ? await notionClient.post<DatabaseQuery>(
        BASE_DATABASE + "/" + id + "/query",
        next_cursor != undefined || next_cursor != null
          ? {
              start_cursor: next_cursor,
            }
          : {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
    : await NotionClient.post<DatabaseQuery>(
        BASE_DATABASE + "/" + id + "/query"
      );

  if (data.has_more) {
    const nextData = await fetchDatabasePages(
      id,
      serverSide,
      token,
      data.next_cursor
    );
    data.results = data.results.concat(nextData.results);
  }
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
    : await NotionClient.get(BASE_DATABASE + "/" + id);
  return data;
};

export const listDatabases = async (
  serverSide = false,
  token = ""
): Promise<DatabaseList> => {
  return await fetchDatabases(serverSide, token);
};

const fetchDatabases = async (
  serverSide = false,
  token = "",
  next_cursor: string | undefined | null = undefined
) => {
  const { data } = serverSide
    ? await notionClient.get<DatabaseList>(BASE_DATABASE, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: {
          start_cursor: next_cursor,
        },
      })
    : await NotionClient.get<DatabaseList>(BASE_DATABASE);

  if (data.has_more && data.results) {
    const nextData = await fetchDatabases(serverSide, token, data.next_cursor);
    if (nextData.results) data.results = data.results.concat(nextData.results);
  }

  return data;
};
