import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import type { Breakpoint, ScreenMap } from "../_util/responsiveObserver";
import { useMergePropByScreen } from "./hooks/useMergePropByScreen";
import { ConfigContext } from "../config-provider";
import RowContext, { RowContextState } from "./RowContext";
import useResponsiveObserver, {
  responsiveArray,
} from "../_util/responsiveObserver";
import { useRowStyle } from "./style";

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

  // to save screens info when responsiveObserve callback had been call
  const [curScreens, setCurScreens] = useState<ScreenMap>(screenMapDefault);

  // to calculate responsive gutter，like [ {xs: ..., sm: ...} ] OR [{xs: ...}, {xs: ...}]
  const [screens, setScreens] = useState<ScreenMap>(screenMapActived);

  // >>>>> responsive data
  const mergedAlign = useMergePropByScreen(align, curScreens);
  const mergedJustify = useMergePropByScreen(justify, curScreens);
  const responseiveObserver = useResponsiveObserver();

  // >>>>> side effect
  useEffect(() => {
    const uid = responseiveObserver.subscribe((screen) => {
      setCurScreens(screen);
      const currentGutter = gutterRef.current || 0;
      if (
        (!Array.isArray(currentGutter) && typeof currentGutter === "object") ||
        (Array.isArray(currentGutter) &&
          (typeof currentGutter[0] === "object" ||
            typeof currentGutter[1] === "object"))
      ) {
        setScreens(screen);
      }
    });

    return () => responseiveObserver.unsubscribe(uid);
  }, [responseiveObserver]);

  // >>>>>> calc gutter
  const getGutter = (): [Gap, Gap] => {
    const gutterArr: [Gap, Gap] = [undefined, undefined]; // 主轴和叉轴两个方向间隔
    const normalizeGutter = Array.isArray(gutter)
      ? gutter
      : [gutter, undefined];
    normalizeGutter.forEach((gt, idx) => {
      if (typeof gt === "object") {
        // 对象如 { xs: "10px", md: ... } 取与当前屏幕尺寸匹配的gutter值
        for (let k = 0; k < responsiveArray.length; ++k) {
          const screenSize: Breakpoint = responsiveArray[k];
          if (screens[screenSize] && gt[screenSize] !== undefined) {
            gutterArr[idx] = gt[screenSize] as number;
            break;
          }
        }
      } else {
        // 非对象则直接复制，如"10px"
        gutterArr[idx] = gt;
      }
    });

    return gutterArr;
  };

  // >>>>> add gutter style
  const gutterArr = getGutter(); // [horizontalGutter, verticalGutter]
  const [gutterH, gutterV] = gutterArr;

  const rowStyle: React.CSSProperties = {};
  rowStyle.rowGap = gutterV;
  const horizontalGutter =
    gutterH != null && gutterH > 0 ? gutterH / -2 : undefined;
  if (horizontalGutter) {
    rowStyle.marginLeft = horizontalGutter;
    rowStyle.marginRight = horizontalGutter;
  }

  // >>>>>> render
  const [wrapCSSVar, hashId, cssVarCls] = useRowStyle(prefixCls);

  const classes = classNames(prefixCls, className, hashId, cssVarCls, {
    [`${prefixCls}-no-wrap`]: wrap === false,
    [`${prefixCls}-${mergedJustify}`]: mergedJustify,
    [`${prefixCls}-${mergedAlign}`]: mergedAlign,
    [`${prefixCls}-rtl`]: direction === "rtl",
  });

  const mergedStyle = {
    ...rowStyle,
    ...style,
  };

  const rowContext = useMemo<RowContextState>(
    () => ({
      gutter: [gutterH, gutterV] as [number, number],
      wrap,
    }),
    [gutterH, gutterV, wrap]
  );

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

export default Row;
