import React, { useContext } from "react";
import classNames from "classnames";
import { composeRef } from "rc-util/lib/ref";

import { DirectionType, ConfigConsumerProps } from "../config-provider";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";

export interface TypographyProps<C extends keyof JSX.IntrinsicElements>
  extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** @internal */
  component?: C; // string type, like 'text', 'link'
  direction?: DirectionType;
}

interface InternalTypographyProps<C extends keyof JSX.IntrinsicElements>
  extends TypographyProps<C> {
  setContentRef?: (node: HTMLElement) => void;
}

////////////////////  Typography ////////////////////
const Typography = React.forwardRef<HTMLElement, InternalTypographyProps<any>>(
  (props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      component: Component = "div", // 默认为div，或article元素
      className,
      rootClassName,
      children,
      style,
      direction: typographyDirection,
      setContentRef,
      ...restProps
    } = props;

    const {
      getPrefixCls,
      direction: contextDirection,
      typography,
    } = useContext<ConfigConsumerProps>(ConfigContext);

    const direction = typographyDirection ?? contextDirection;

    let mergedRef = ref;
    if (setContentRef) {
      mergedRef = composeRef(ref, setContentRef);
    }

    const prefixCls = getPrefixCls("typography", customizePrefixCls); // jay-typography

    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

    const componentClassNames = classNames(
      prefixCls,
      typography?.className,
      className,
      rootClassName,
      hashId,
      cssVarCls,
      {
        [`${prefixCls}-rtl`]: direction === "rtl",
      }
    );

    const mergedStyle: React.CSSProperties = { ...typography?.style, ...style };

    const typographyNode = (
      <Component
        ref={mergedRef}
        className={componentClassNames}
        style={mergedStyle}
        {...restProps}
      >
        {children}
      </Component>
    );

    if (typeof wrapCSSVar === "function") {
      return wrapCSSVar(typographyNode); // 注入CSS样式
    }

    return typographyNode;
  }
);

export default Typography;
