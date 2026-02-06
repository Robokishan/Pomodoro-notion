export interface IAppState {
  noisesRunning: Array<string>;
  /** Index in the noises list for media keys next/previous track */
  currentTrackIndex: number;
  /**
   * When user presses media Pause, we store the current combination here.
   * Media Play then restores this exact combination (one-click resume).
   */
  pausedNoisesSnapshot: Array<string>;
}

export const initialState: IAppState = {
  noisesRunning: [],
  currentTrackIndex: 0,
  pausedNoisesSnapshot: [],
};

export enum actionTypes {
  ADD_NOISE_RUNNING = "ADD_NOISE_RUNNING",
  REMOVE_NOISE_RUNNING = "REMOVE_NOISE_RUNNING",
  STOP_ALL_NOISES = "STOP_ALL_NOISES",
  SET_CURRENT_TRACK_INDEX = "SET_CURRENT_TRACK_INDEX",
  /** Media key Pause: store current noises and stop all */
  MEDIA_PAUSE_NOISES = "MEDIA_PAUSE_NOISES",
  /** Media key Play: restore previously paused combination */
  RESTORE_PAUSED_NOISES = "RESTORE_PAUSED_NOISES",
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

type SET_CURRENT_TRACK_INDEX = {
  type: actionTypes.SET_CURRENT_TRACK_INDEX;
  payload: number;
};

type MEDIA_PAUSE_NOISES = {
  type: actionTypes.MEDIA_PAUSE_NOISES;
  payload: string[]; // current noisesRunning to remember
};

type RESTORE_PAUSED_NOISES = {
  type: actionTypes.RESTORE_PAUSED_NOISES;
};

export type IAction =
  | ADD_NOISE_RUNNING
  | REMOVE_NOISE_RUNNING
  | STOP_ALL_NOISES
  | SET_CURRENT_TRACK_INDEX
  | MEDIA_PAUSE_NOISES
  | RESTORE_PAUSED_NOISES;

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
        pausedNoisesSnapshot: [], // user explicitly stopped; clear resume snapshot
      };
    }
    case actionTypes.SET_CURRENT_TRACK_INDEX: {
      return {
        ...state,
        currentTrackIndex: action.payload,
      };
    }
    case actionTypes.MEDIA_PAUSE_NOISES: {
      return {
        ...state,
        noisesRunning: [],
        pausedNoisesSnapshot: action.payload,
      };
    }
    case actionTypes.RESTORE_PAUSED_NOISES: {
      const toRestore = state.pausedNoisesSnapshot;
      return {
        ...state,
        noisesRunning: [...toRestore],
        pausedNoisesSnapshot: [],
      };
    }
    default:
      return state;
  }
};

export default reducer;
