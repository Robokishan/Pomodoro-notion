import { createContext, useContext, useReducer } from "react";
import { IAction, IAppState, initialState } from "./reducer";
export type IAppContext = [IAppState, React.Dispatch<IAction>];
const defaultDispatch: React.Dispatch<IAction> = () => initialState; // we never actually use this

export const StateContext = createContext<IAppContext>([
  initialState,
  defaultDispatch,
]);

export const ProjectStateProvider = ({
  reducer,
  initialState,
  children,
}: {
  reducer: React.Reducer<IAppState, IAction>;
  initialState: IAppState;
  children: React.ReactNode;
}) => (
  <StateContext.Provider
    value={useReducer(reducer, initialState)}
  >
    {children}
  </StateContext.Provider>
);

export const useProjectState = () => useContext(StateContext);
