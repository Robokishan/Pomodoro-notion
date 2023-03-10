export type TimerLabelType = "Session" | "Break";

export interface IAppState {
  busyIndicator: boolean;
  breakValue: number;
  sessionValue: number;
  timerValue: number;
  timerLabel: TimerLabelType;
  frozePomodoro: boolean;
  project?: { label: string; value: string } | null;
  databaseId?: string;
  shouldTickSound: boolean;
  tickVolume: number;
  startTime: number; //when session is started
}

export const DEFAULT_SESSION_TIMER = 45;
export const DEFAULT_BREAK_TIEMR = 15;
export const DEFAULT_TIMER_VALUE = DEFAULT_SESSION_TIMER * 60;

const timerInit = {
  breakValue: DEFAULT_BREAK_TIEMR,
  sessionValue: DEFAULT_SESSION_TIMER,
  startTime: 0,
};

const soundInit = {
  shouldTickSound: false,
  tickVolume: 0.4,
};

const session = {
  timerLabel: "Session",
  // timerValue is the initial value of 45 minnutes multiplied by 60 in order to have it in seconds much more easily decreasable by 1
  timerValue: DEFAULT_TIMER_VALUE, //2700, // TODO: for debug timer set 2
} as const;

const initialTimer = {
  ...session,
  ...timerInit,
} as const;

export const initialState: IAppState = {
  busyIndicator: false,
  frozePomodoro: true,
  ...initialTimer,
  ...soundInit,
};

export enum actionTypes {
  FROZE_POMODORO = "FROZE_POMODORO",
  RESTART_POMODORO = "RESTART_POMODORO",
  SET_PROJECTNAME = "SET_PROJECTNAME",
  SET_PROJECTID = "SET_PROJECTID",
  SET_DATABASEID = "SET_DATABASEID",
  RESET_TIMERS = "RESET_TIMERS",
  RESET_STATE = "RESET_STATE",
  START_TIMER = "START_TIMER",
  TOGGLE_TIMER_LABEL = "TOGGLE_TIMER_LABEL",
  TOGGLE_ISBUSY_INDICATOR = "TOGGLE_ISBUSY_INDICATOR",
  INCREASE_BREAK_VALUE = "INCREASE_BREAK_VALUE",
  DECREASE_BREAK_VALUE = "DECREASE_BREAK_VALUE",
  INCREASE_SESSION_VALUE = "INCREASE_SESSION_VALUE",
  DECREASE_SESSION_VALUE = "DECREASE_SESSION_VALUE",
  CHANGE_TICKING_SOUND = "CHANGE_TICKING_SOUND",
  CHANGE_TICK_VOLUME = "CHANGE_TICK_VOLUME",
  SET_START_TIME = "SET_START_TIME",
}

type SET_PROJECTID = {
  type: actionTypes.SET_PROJECTID;
  payload?: {
    label: string;
    value: string;
  } | null;
};

type SET_START_TIME = {
  type: actionTypes.SET_START_TIME;
  payload: number;
};

type SET_DATABASEID = {
  type: actionTypes.SET_DATABASEID;
  payload: string;
};

export type IAction =
  | {
    type: actionTypes.CHANGE_TICKING_SOUND;
    payload: boolean;
  }
  | { type: actionTypes.RESTART_POMODORO }
  | { type: actionTypes.RESET_STATE }
  | SET_PROJECTID
  | SET_DATABASEID
  | {
    type: actionTypes.SET_PROJECTNAME;
    payload: { projectName: string; timerLabel: TimerLabelType };
  }
  | { type: actionTypes.FROZE_POMODORO; payload: boolean }
  | { type: actionTypes.RESET_TIMERS }
  | { type: actionTypes.START_TIMER; payload: { timerValue: number } }
  | {
    type: actionTypes.TOGGLE_TIMER_LABEL;
    payload: { timerLabel: TimerLabelType };
  }
  | {
    type: actionTypes.TOGGLE_ISBUSY_INDICATOR;
    payload: { busyIndicator: boolean };
  }
  | { type: actionTypes.INCREASE_BREAK_VALUE; payload: { breakValue: number } }
  | { type: actionTypes.DECREASE_BREAK_VALUE; payload: { breakValue: number } }
  | {
    type: actionTypes.INCREASE_SESSION_VALUE;
    payload: { sessionValue: number; timerValue: number };
  }
  | {
    type: actionTypes.DECREASE_SESSION_VALUE;
    payload: { sessionValue: number; timerValue: number };
  }
  | {
    type: actionTypes.CHANGE_TICK_VOLUME;
    payload: number;
  }
  | SET_START_TIME;

const reducer = (state = initialState, action: IAction): IAppState => {
  switch (action.type) {
    case actionTypes.SET_PROJECTID:
      return {
        ...state,
        project: action.payload ?? null,
      };
    case actionTypes.SET_DATABASEID:
      return {
        ...state,
        databaseId: action.payload,
      };
    case actionTypes.FROZE_POMODORO:
      return {
        ...state,
        frozePomodoro: action.payload,
      };
    case actionTypes.SET_PROJECTNAME:
      return {
        ...state,
        timerLabel: action.payload.timerLabel,
      };
    case actionTypes.INCREASE_BREAK_VALUE:
      return {
        ...state,
        breakValue: action.payload.breakValue,
      };
    case actionTypes.DECREASE_BREAK_VALUE:
      return {
        ...state,
        breakValue: action.payload.breakValue,
      };
    case actionTypes.INCREASE_SESSION_VALUE:
      return {
        ...state,
        sessionValue: action.payload.sessionValue,
        timerValue: action.payload.timerValue,
      };
    case actionTypes.DECREASE_SESSION_VALUE:
      return {
        ...state,
        sessionValue: action.payload.sessionValue,
        timerValue: action.payload.timerValue,
      };
    case actionTypes.TOGGLE_ISBUSY_INDICATOR:
      return {
        ...state,
        busyIndicator: action.payload.busyIndicator,
      };
    case actionTypes.TOGGLE_TIMER_LABEL:
      return {
        ...state,
        timerLabel: action.payload.timerLabel,
      };
    case actionTypes.START_TIMER:
      return {
        ...state,
        timerValue: action.payload.timerValue,
      };
    case actionTypes.RESET_STATE:
      return {
        ...state,
        ...initialTimer,
      };
    case actionTypes.RESET_TIMERS:
      return {
        ...state,
        ...session,
        timerValue: state.sessionValue * 60,
      };
    case actionTypes.RESTART_POMODORO:
      return {
        ...state,
        timerLabel: "Session",
        timerValue: state.sessionValue * 60,
      };
    case actionTypes.CHANGE_TICKING_SOUND:
      return {
        ...state,
        shouldTickSound: action.payload,
      };
    case actionTypes.CHANGE_TICK_VOLUME:
      return {
        ...state,
        tickVolume: action.payload,
      };
    case actionTypes.SET_START_TIME:
      return {
        ...state,
        startTime: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
