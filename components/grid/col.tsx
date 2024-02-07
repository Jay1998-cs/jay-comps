import React from "react";
import classNames from "classnames";

import { ConfigContext } from "../config-provider";
import RowContext from "./RowContext";
import { useColStyle } from "./style";

export type LiteralUnion<T extends string> = T | (string & {});

type ColSpanType = number | string; // 数字 或者 含尺寸单位(px, %等)的字符串
type FlexType = number | LiteralUnion<"none" | "auto">;

export interface ColSize {
  flex?: FlexType;
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  flex?: FlexType;
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
  xs?: ColSpanType | ColSize;
  sm?: ColSpanType | ColSize;
  md?: ColSpanType | ColSize;
  lg?: ColSpanType | ColSize;
  xl?: ColSpanType | ColSize;
  xxl?: ColSpanType | ColSize;
}

// 解析传入Col组件的flex属性，转换为CSS中的flex属性值
function parseFlex(flex: FlexType): string {
  // flex-grow, flex-shrink
  if (typeof flex === "number") {
    return `${flex} ${flex} auto`;
  }
  // flex-basis
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
}

const sizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

//////////////////// Col ////////////////////
const Col = React.forwardRef<HTMLDivElement, ColProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    flex,
    order,
    span,
    offset,
    push,
    pull,
    style,
    children,
    ...restProps
  } = props;

  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls("col", customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useColStyle(prefixCls);

  // >>>>> component className
  let sizeClassObj = {}; // 存储相关尺寸(如xs, md, ..., xxl)对应的类名信息

  sizes.forEach((size) => {
    let sizeProps: ColSize = {};
    const propSize = props[size];
    if (typeof propSize === "number") {
      sizeProps.span = propSize; // 如 xs:3 -> {span:3} 表示Col所占栅格数
    } else if (typeof propSize === "object") {
      sizeProps = propSize || {}; // 如 {xs:3, md: 4} 动态设置Col所占栅格数
    }
    delete restProps[size];

    sizeClassObj = {
      ...sizeClassObj, // 之前sizeClassObj的数据(不断累加直到遍历结束)
      [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
      [`${prefixCls}-${size}-order-${sizeProps.order}`]:
        sizeProps.order || sizeProps.order === 0,
      [`${prefixCls}-${size}-offset-${sizeProps.offset}`]:
        sizeProps.offset || sizeProps.offset === 0,
      [`${prefixCls}-${size}-push-${sizeProps.push}`]:
        sizeProps.push || sizeProps.push === 0,
      [`${prefixCls}-${size}-pull-${sizeProps.pull}`]:
        sizeProps.pull || sizeProps.pull === 0,
      [`${prefixCls}-${size}-flex-${sizeProps.flex}`]:
        sizeProps.flex || sizeProps.flex === "auto",
      [`${prefixCls}-rtl`]: direction === "rtl",
    };
  });

  const classes = classNames(
    prefixCls,
    className,
    hashId,
    cssVarCls,
    sizeClassObj,
    {
      [`${prefixCls}-${span}`]: span !== undefined,
      [`${prefixCls}-order-${order}`]: order,
      [`${prefixCls}-offset-${offset}`]: offset,
      [`${prefixCls}-push-${push}`]: push,
      [`${prefixCls}-pull-${pull}`]: pull,
    }
  );

  // >>>>> calc horizontal gutter
  const styleObj: React.CSSProperties = {};
  const { gutter, wrap } = React.useContext(RowContext);
  if (gutter && gutter[0] > 0) {
    // Horizontal gutter use padding
    const horizontalGutter = gutter[0] / 2;
    styleObj.paddingLeft = horizontalGutter;
    styleObj.paddingRight = horizontalGutter;
  }

  // >>>>> parse flex prop
  if (flex) {
    styleObj.flex = parseFlex(flex);

    // Hack for Firefox to avoid size issue
    // https://github.com/ant-design/ant-design/pull/20023#issuecomment-564389553
    if (wrap === false && !styleObj.minWidth) {
      styleObj.minWidth = 0;
    }
  }

  // >>>>> render
  const colNode = (
    <div
      {...restProps}
      style={{ ...styleObj, ...style }}
      className={classes}
      ref={ref}
    >
      {children}
    </div>
  );

  if (typeof wrapCSSVar === "function") {
    return wrapCSSVar(colNode);
  }

  return colNode;
});

export default Col;
