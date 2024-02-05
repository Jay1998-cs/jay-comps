import React, { useContext } from "react";
import classNames from "classnames";
import omit from "rc-util/lib/omit";

import { isPresetSize } from "../_util/gapSize";
import { ConfigContext } from "../config-provider";
import type { ConfigConsumerProps } from "../config-provider";
import { SizeType } from "../config-provider/SizeContext";
import genFlexClassNames from "./genFlexClassNames";
import useStyle from "./style";

export interface FlexProps extends React.HtmlHTMLAttributes<HTMLElement> {
  prefixCls?: string;
  rootClassName?: string;
  vertical?: boolean;
  wrap?: React.CSSProperties["flexWrap"];
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  flex?: React.CSSProperties["flex"];
  gap?: React.CSSProperties["gap"] | SizeType;
  children?: React.ReactNode;
  component?: any;
}

const Flex = React.forwardRef<HTMLElement, FlexProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    flex,
    gap,
    children,
    vertical = false,
    component: Component = "div",
    ...restProps
  } = props;

  const {
    getPrefixCls,
    direction: ctxDirection,
    flex: ctxFlex,
  } = useContext<ConfigConsumerProps>(ConfigContext);

  const prefixCls = getPrefixCls("flex", customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls = ""] = useStyle(prefixCls);

  const mergedVertical = vertical ?? ctxFlex?.vertical;
  const mergedStyle = { ...ctxFlex?.style, ...style };

  const flexClassNames = classNames(
    className,
    rootClassName,
    ctxFlex?.className,
    prefixCls,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-gap-${gap}`]: isPresetSize(gap),
      [`${prefixCls}-vertical`]: mergedVertical,
      [`${prefixCls}-rtl`]: ctxDirection === "rtl",
    },
    genFlexClassNames(prefixCls, props)
  );

  if (flex) {
    mergedStyle.flex = flex;
  }
  if (gap && !isPresetSize(gap)) {
    mergedStyle.gap = gap;
  }

  const flexNode = (
    <Component
      ref={ref}
      className={flexClassNames}
      style={mergedStyle}
      {...omit(restProps, ["justify", "align", "wrap"])}
    >
      {children}
    </Component>
  );

  if (typeof wrapCSSVar === "function") {
    return wrapCSSVar(flexNode);
  }
  return flexNode;
});

export default Flex;
