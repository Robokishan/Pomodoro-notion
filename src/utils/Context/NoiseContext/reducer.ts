export interface IAppState {
  noisesRunning: Array<string>;
}

export const initialState: IAppState = {
  noisesRunning: [],
};

export enum actionTypes {
  ADD_NOISE_RUNNING = "ADD_NOISE_RUNNING",
  REMOVE_NOISE_RUNNING = "REMOVE_NOISE_RUNNING",
  STOP_ALL_NOISES = "STOP_ALL_NOISES",
}

type ADD_NOISE_RUNNING = {
  type: actionTypes.ADD_NOISE_RUNNING;
  payload: string;
};

type REMOVE_NOISE_RUNNING = {
  type: actionTypes.REMOVE_NOISE_RUNNING;
  payload: string;
};

type STOP_ALL_NOISES = {
  type: actionTypes.STOP_ALL_NOISES;
};

export type IAction =
  | ADD_NOISE_RUNNING
  | REMOVE_NOISE_RUNNING
  | STOP_ALL_NOISES;

const reducer = (state = initialState, action: IAction): IAppState => {
  switch (action.type) {
    case actionTypes.ADD_NOISE_RUNNING: {
      return {
        ...state,
        noisesRunning: [...state.noisesRunning, action.payload],
      };
    }

    case actionTypes.REMOVE_NOISE_RUNNING: {
      return {
        ...state,
        noisesRunning: state.noisesRunning.filter(
          (item) => item !== action.payload
        ),
      };
    }
    case actionTypes.STOP_ALL_NOISES: {
      return {
        ...state,
        noisesRunning: [],
      };
    }
    default:
      return state;
  }
};

export default reducer;
