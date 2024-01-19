import React, { createContext, useContext } from "react";

export type SizeType = "large" | "middle" | "small" | undefined;

const sizeContext = createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: React.ReactNode;
}

export const SizeContextProvider: React.FC<SizeContextProps> = (props) => {
  const { size, children } = props;
  const originSize = useContext<SizeType>(sizeContext);

  return (
    <sizeContext.Provider value={size || originSize}>
      {children}
    </sizeContext.Provider>
  );
};

export default sizeContext;
