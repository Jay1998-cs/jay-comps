import React, { useContext } from "react";
import classNames from "classnames";
import omit from "rc-util/lib/omit";

import { isPresetSize } from "../_util/gapSize";
import { ConfigContext } from "../config-provider";
import type { ConfigConsumerProps } from "../config-provider";
import { SizeType } from "../config-provider/SizeContext";

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

  const { getPrefixCls, direction: ctxDirection } = useContext(ConfigContext);

  const prefixCls = getPrefixCls("flex", customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls = ""] = useStyle(prefixCls);

  const flexClassNames = classNames(
    className,
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-gap-${gap}`]: isPresetSize(gap),
      [`${prefixCls}-vertical`]: vertical,
      [`${prefixCls}-rtl`]: ctxDirection === "rtl",
    }
  );

  return null;
});

export default Flex;
