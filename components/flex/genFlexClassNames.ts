import classNames from "classnames";

import type { FlexProps } from ".";

export const flexWrapValues = ["wrap", "nowrap", "wrap-reverse"] as const;

export const justifyContentValues = [
  "flex-start",
  "flex-end",
  "start",
  "end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
  "stretch",
  "normal",
  "left",
  "right",
] as const;

export const alignItemsValues = [
  "start",
  "end",
  "center",
  "flex-start",
  "flex-end",
  "self-start",
  "self-end",
  "baseline",
  "normal",
  "stretch",
] as const;

const genWrapCls = (prefixCls: string, wrap: FlexProps["wrap"]) => {
  const wrapCls: Record<PropertyKey, boolean> = {};
  flexWrapValues.forEach((key) => {
    wrapCls[`${prefixCls}-wrap-${key}`] = wrap === key;
  });

  return wrapCls;
};

const genjustifyCls = (prefixCls: string, justify: FlexProps["justify"]) => {
  const justifyCls: Record<PropertyKey, boolean> = {};
  justifyContentValues.forEach((key) => {
    justifyCls[`${prefixCls}-justify-${key}`] = justify === key;
  });

  return justifyCls;
};

const genAlignCls = (prefixCls: string, align: FlexProps["align"]) => {
  const alignCls: Record<PropertyKey, boolean> = {};
  alignItemsValues.forEach((key) => {
    alignCls[`${prefixCls}-align-${key}`] = align === key;
  });

  return alignCls;
};

function genFlexClassNames(prefixCls: string, props: FlexProps) {
  return classNames({
    ...genWrapCls(prefixCls, props.wrap),
    ...genjustifyCls(prefixCls, props.justify),
    ...genAlignCls(prefixCls, props.align),
  });
}

export default genFlexClassNames;
