import React from "react";

export interface RowContextState {
  gutter?: [number, number];
  wrap?: boolean;
}

const RowContext = React.createContext<RowContextState>({});

export default RowContext;
