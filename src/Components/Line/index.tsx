import React from "react";

export interface LineProps {
  margin?: string;
  width?: string;
  backgroundColor?: string;
  height: string;
}

const Line: React.FC<LineProps> = ({ ...props }: LineProps) => (
  <div
    style={{
      ...props,
    }}
  />
);

export default Line;
