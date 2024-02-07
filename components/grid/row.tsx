import React from "react";
import classNames from "classnames";

import type { Breakpoint, ScreenMap } from "../_util/responsiveObserver";
import { ConfigContext } from "../config-provider";
import RowContext from "./RowContext";
// import { useRowStyle } from "./style";
// import useResponsiveObserver, {
//   responsiveArray,
// } from "../_util/responsiveObserver";

const RowAligns = ["top", "middle", "bottom", "stretch"] as const;
const RowJustify = [
  "start",
  "end",
  "center",
  "space-around",
  "space-between",
  "space-evenly",
];

type Responsive = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
type ResponsiveLike<T> = {
  [key in Responsive]?: T;
};

type Gap = number | undefined;
export type Gutter = number | undefined | Partial<Record<Breakpoint, number>>;
