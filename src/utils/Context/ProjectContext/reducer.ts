import { Result } from "../../../types/database/databaseQuery";
import { Result as DatabaseList } from "../../../types/database/database.list";
import {
  ProjectAnalytics,
  ProjectTimeSheetsType,
} from "../../../types/projects";

type NOTION_PROJECTS = Result[];
type NOTION_DATABASE = DatabaseList[];

export interface IAppState {
  projectTimesheets: ProjectTimeSheetsType[];
  projectAnalysis: ProjectAnalytics;
  notionProjects: NOTION_PROJECTS;
  notionDatabase: NOTION_DATABASE;
}

export const initialState: IAppState = {
  projectAnalysis: {},
  projectTimesheets: [],
  notionProjects: [],
  notionDatabase: [],
};

export enum actionTypes {
  UPDATE_PROJECT_ANALYSIS = "UPDATE_PROJECT_ANALYSIS",
  UPDATE_PROJECT_TIMESHEETS = "UPDATE_PROJECT_TIMESHEETS",
  UPDATE_NOTION_PROJECTS = "UPDATE_NOTION_PROJECTS",
  UPDATE_NOTION_DATABASES = "UPDATE_NOTION_DATABASES",
}

type UPDATE_PROJECT_ANALYSIS = {
  type: actionTypes.UPDATE_PROJECT_ANALYSIS;
  payload: ProjectAnalytics;
};

type UPDATE_PROJECT_TIMESHEETS = {
  type: actionTypes.UPDATE_PROJECT_TIMESHEETS;
  payload: ProjectTimeSheetsType[];
};

type UPDATE_NOTION_PROJECTS = {
  type: actionTypes.UPDATE_NOTION_PROJECTS;
  payload: NOTION_PROJECTS;
};
type UPDATE_NOTION_DATABASES = {
  type: actionTypes.UPDATE_NOTION_DATABASES;
  payload: NOTION_DATABASE;
};

export type IAction =
  | UPDATE_PROJECT_ANALYSIS
  | UPDATE_PROJECT_TIMESHEETS
  | UPDATE_NOTION_PROJECTS
  | UPDATE_NOTION_DATABASES;

const reducer = (state = initialState, action: IAction): IAppState => {
  switch (action.type) {
    case actionTypes.UPDATE_PROJECT_ANALYSIS:
      return {
        ...state,
        projectAnalysis: action.payload,
      };
    case actionTypes.UPDATE_PROJECT_TIMESHEETS:
      return {
        ...state,
        projectTimesheets: action.payload,
      };
    case actionTypes.UPDATE_NOTION_PROJECTS:
      return {
        ...state,
        notionProjects: action.payload,
      };
    case actionTypes.UPDATE_NOTION_DATABASES:
      return {
        ...state,
        notionDatabase: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
