export interface IAppState {
  userId: string;
  startDate: number;
  endDate: number;
}

export const initialState: IAppState = {
  userId: "",
  startDate: Math.floor(new Date().getTime() / 1000),
  endDate: Math.floor(new Date().getTime() / 1000),
};

export enum actionTypes {
  SET_USERID = "SET_USERID",
  SET_DATES = "SET_DATES",
}

type SET_USERID = {
  type: actionTypes.SET_USERID;
  payload: string;
};

type SET_DATES = {
  type: actionTypes.SET_DATES;
  payload: {
    startDate?: number;
    endDate?: number;
  };
};

export type IAction = SET_USERID | SET_DATES;

const reducer = (state = initialState, action: IAction): IAppState => {
  switch (action.type) {
    case actionTypes.SET_USERID:
      return {
        ...state,
        userId: action.payload,
      };
    case actionTypes.SET_DATES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
