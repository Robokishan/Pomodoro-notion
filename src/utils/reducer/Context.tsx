import { createContext, useContext, useReducer } from "react";
import { IAction, IAppState, initialState } from ".";
export type IAppContext = [IAppState, React.Dispatch<IAction>];
const defaultDispatch: React.Dispatch<IAction> = () => initialState; // we never actually use this

export const StateContext = createContext<IAppContext>([
  initialState,
  defaultDispatch,
]);

export const TimerStateProvider = ({
  reducer,
  initialState,
  children,
}: {
  reducer: any;
  initialState: any;
  children: JSX.Element | React.ReactNode;
}) => (
  <StateContext.Provider
    value={useReducer<React.Reducer<IAppState, IAction>>(reducer, initialState)}
  >
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);