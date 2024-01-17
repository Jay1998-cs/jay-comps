import React from "react";
import { createContext } from "react";

import { SizeType } from "./buttonTypes";

export interface ButtonGroupProps {
  size?: SizeType;
  style?: React.CSSProperties;
  className?: string;
  prefixCls?: string;
  children?: React.ReactNode;
}

export const GroupSizeContext = createContext<SizeType>(undefined);

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
  // const { getPrefixCls, direction } = createContext(ConfigContext);

  const { prefixCls: customizePrefixCls, size, className, ...others } = props;

  return (
    <GroupSizeContext.Provider value={size}>
      <div {...others} className="classes" />
    </GroupSizeContext.Provider>
  );
};

export default ButtonGroup;
