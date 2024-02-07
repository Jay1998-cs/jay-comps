import React from "react";

import { GridToken } from "../grid/style";
import { useToken } from "../theme";

export type Breakpoint = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
export type BreakpointMap = Record<Breakpoint, string>;
export type ScreenMap = Partial<Record<Breakpoint, boolean>>;
export type ScreenSizeMap = Partial<Record<Breakpoint, number>>;

type SubscribeFunc = (screens: ScreenMap) => void;

export const responsiveArray: Breakpoint[] = [
  "xxl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
];

/**
 * @description 响应式屏幕尺寸表, 如 `@media` screen (max-width: 720px) 中的括号部分
 * @returns `{xs: (max-wdith: ...), md: (min-width:...), ...}`
 */
const getResponsiveMap = (token: GridToken): BreakpointMap => ({
  xs: `(max-width: ${token.screenXSMax}px)`, // 超小屏的最大取值，不大于该值的都属于超小屏
  sm: `(min-width: ${token.screenSM}px)`, // 小屏的最小取值，不小于该值的都为小屏
  md: `(min-width: ${token.screenMD}px)`,
  lg: `(min-width: ${token.screenLG}px)`,
  xl: `(min-width: ${token.screenXL}px)`,
  xxl: `(min-width: ${token.screenXXL}px)`,
});

/**
 * @description 检验响应式screen的取值(x)是否合理(xMin <= x <= xMax 且 xMax <= next_xMin)
 * @returns 合理则返回原token，否则抛出错误
 */
const validateBreakpoints = (token: GridToken) => {
  const screenToken: any = token;
  const revBreakpoints = [...responsiveArray].reverse();
  const MAX_BP_INDEX = revBreakpoints.length - 1;

  // 设尺寸为x, 那么 x 取值范围是 [xMin, xMax], 并且 xMax <= next_xMin
  revBreakpoints.forEach((breakpoint: Breakpoint, i: number) => {
    const breakpointUpper = breakpoint.toUpperCase(); // 如XS
    const screenMin = `screen${breakpointUpper}Min`; // token中screen的变量名，如screenXSMin
    const screen = `screen${breakpointUpper}`; // 如screenXS
    const screenMinVal = screenToken[screenMin]; // 如200表示最小尺寸为200px
    const screenVal = screenToken[screen]; // 当前尺寸大小

    // 抛出错误: x < xMin
    if (screenVal < screenMin) {
      throw new Error(
        `${screenMin}<=${screen} fails : !(${screenMinVal}<=${screenVal})`
      );
    }

    if (i < MAX_BP_INDEX) {
      // 抛出错误: x > xMax
      const screenMax = `screen${breakpointUpper}Max`;
      const screenMaxVal = screenToken[screenMax];
      if (screenVal > screenMax) {
        throw new Error(
          `${screen}<=${screenMax} fails : !(${screenVal}<=${screenMaxVal})`
        );
      }
      // 抛出错误: xMax > next_xMin
      const nextBreakpointUpperMin = revBreakpoints[i + 1].toUpperCase();
      const nextScreenMin = `screen${nextBreakpointUpperMin}Min`;
      const nextScreenMinVal = screenToken[nextScreenMin];
      if (screenMaxVal > nextScreenMinVal) {
        throw new Error(
          `${screenMax}<=${nextScreenMin} fails : !(${screenMaxVal}<=${nextScreenMinVal})`
        );
      }
    }
  });

  return token;
};

export default function useResponsiveObserver() {
  const [token] = useToken();
  const responsiveMap: BreakpointMap = getResponsiveMap(
    validateBreakpoints(token)
  );

  return React.useMemo(() => {
    const subscribers = new Map<Number, SubscribeFunc>();
    let subUid = -1;
    let screens = {};

    const instance = {
      matchHandlers: {} as {
        [prop: string]: {
          mql: MediaQueryList;
          listener:
            | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
            | null;
        };
      },
      dispatch(pointMap: ScreenMap) {
        screens = pointMap;
        subscribers.forEach((func) => func(screens));
        return subscribers.size >= 1;
      },
      subscribe(func: SubscribeFunc) {
        if (!subscribers.size) this.rigister();
        subUid += 1;
        subscribers.set(subUid, func);
        func(screens);
        return subUid;
      },
      unsubscribe(id: number) {
        subscribers.delete(id);
        if (!subscribers.size) this.unregister();
      },
      unregister() {
        Object.keys(responsiveMap).forEach((point: Breakpoint) => {
          const matchMediaQuery = responsiveMap[point];
          const handler = this.matchHandlers[matchMediaQuery];
          handler?.mql.removeListener(handler?.listener);
        });
        subscribers.clear();
      },
      rigister() {
        Object.keys(responsiveMap).forEach((point: Breakpoint) => {
          const matchMediaQuery = responsiveMap[point];
          const listener = ({ matches }: { matches: boolean }) => {
            this.dispatch({
              ...screens,
              [point]: matches,
            });
          };
          const mql = window.matchMedia(matchMediaQuery);
          mql.addListener(listener);
          this.matchHandlers[matchMediaQuery] = {
            mql,
            listener,
          };

          listener(mql);
        });
      },
      responsiveMap,
    };

    return instance;
  }, [token]);
}
