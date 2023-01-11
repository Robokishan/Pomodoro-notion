import React from "react";
import { NoiseStateProvider } from "./Context";
import reducer, { initialState } from "./reducer";

type Props = {
  children: JSX.Element | React.ReactNode;
};

export default function NoiseContext({ children }: Props) {
  return (
    <NoiseStateProvider reducer={reducer} initialState={initialState}>
      {children}
    </NoiseStateProvider>
  );
}
