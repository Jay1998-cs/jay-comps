import React from "react";
import { DirectionType } from "../config-provider";

export interface TypographyProps<C extends keyof JSX.IntrinsicElements>
  extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** @internal */
  component?: C;
  direction?: DirectionType;
}
