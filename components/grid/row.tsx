import React, { forwardRef, useContext, useRef, useState } from "react";
import classNames from "classnames";

import type { Breakpoint, ScreenMap } from "../_util/responsiveObserver";
import { useMergePropByScreen } from "./hooks/useMergePropByScreen";
import { ConfigContext } from "../config-provider";
import RowContext from "./RowContext";
import useResponsiveObserver from "../_util/responsiveObserver";
// import { useRowStyle } from "./style";

const RowAligns = ["top", "middle", "bottom", "stretch"] as const;
const RowJustify = [
  "start",
  "end",
  "center",
  "space-around",
  "space-between",
  "space-evenly",
] as const;

type Responsive = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
type ResponsiveLike<T> = {
  [key in Responsive]?: T;
};
type ResponsiveAlign = ResponsiveLike<(typeof RowAligns)[number]>;
type ResponsiveJustify = ResponsiveLike<(typeof RowJustify)[number]>;

type Gap = number | undefined;
export type Gutter = number | undefined | Partial<Record<Breakpoint, number>>;

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  gutter?: Gutter | [Gutter, Gutter];
  align?: (typeof RowAligns)[number] | ResponsiveAlign;
  justify?: (typeof RowJustify)[number] | ResponsiveJustify;
  wrap?: boolean;
}

const screenMapDefault: ScreenMap = {
  xxl: false,
  xl: false,
  lg: false,
  md: false,
  sm: false,
  xs: false,
};

const screenMapActived: ScreenMap = {
  xxl: true,
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
};

////////////////////// Row //////////////////////
const Row = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    justify,
    align,
    wrap,
    style,
    children,
    gutter = 0,
    ...restProps
  } = props;

  const { getPrefixCls, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("row", customizePrefixCls);

  const gutterRef = useRef<Gutter | [Gutter, Gutter]>(gutter);

  const [screens, setScreens] = useState<ScreenMap>(screenMapActived);

  // to save screens info when responsiveObserve callback had been call
  const [curScreens, setCurScreens] = useState<ScreenMap>(screenMapDefault);

  const [wrapCSSVar, hashId, cssVarCls] = useRowStyle(prefixCls);

  // >>>>> calc responsive data
  const mergedAlign = useMergePropByScreen(align, curScreens);
  const mergedJustify = useMergePropByScreen(justify, curScreens);
  const responseiveObserver = useResponsiveObserver();

  // >>>>>> render
  let rowNode = (
    <RowContext.Provider value={rowContext}>
      <div {...restProps} ref={ref} style={mergedStyle} className={classes}>
        {children}
      </div>
    </RowContext.Provider>
  );

  if (typeof wrapCSSVar === "function") {
    return wrapCSSVar(rowNode);
  }

  return rowNode;
});
