import { Result } from "../../../types/database/databaseQuery";
import {
  ProjectAnalytics,
  ProjectTimeSheetsType,
} from "../../../types/projects";

type NOTION_PROJECTS = Result[];

export interface IAppState {
  projectTimesheets: ProjectTimeSheetsType;
  projectAnalysis: ProjectAnalytics;
  notionProjects: NOTION_PROJECTS;
}

export const initialState: IAppState = {
  projectAnalysis: {},
  projectTimesheets: [],
  notionProjects: [],
};

export enum actionTypes {
  UPDATE_PROJECT_ANALYSIS = "UPDATE_PROJECT_ANALYSIS",
  UPDATE_PROJECT_TIMESHEETS = "UPDATE_PROJECT_TIMESHEETS",
  UPDATE_NOTION_PROJECTS = "UPDATE_NOTION_PROJECTS",
}

type UPDATE_PROJECT_ANALYSIS = {
  type: actionTypes.UPDATE_PROJECT_ANALYSIS;
  payload: ProjectAnalytics;
};

type UPDATE_PROJECT_TIMESHEETS = {
  type: actionTypes.UPDATE_PROJECT_TIMESHEETS;
  payload: ProjectTimeSheetsType;
};

type UPDATE_NOTION_PROJECTS = {
  type: actionTypes.UPDATE_NOTION_PROJECTS;
  payload: NOTION_PROJECTS;
};

export type IAction =
  | UPDATE_PROJECT_ANALYSIS
  | UPDATE_PROJECT_TIMESHEETS
  | UPDATE_NOTION_PROJECTS;

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
    default:
      return state;
  }
};

export default reducer;
