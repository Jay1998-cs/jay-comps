import React, { createRef, forwardRef, useContext } from "react";

import type {
  ButtonType,
  ButtonShape,
  ButtonHTMLType,
  SizeType,
} from "./buttonTypes";
import { ConfigContext } from "../config-provider/context";
import { composeRef } from "rc-util/lib/ref";
import { DisabledContext } from "../config-provider/DisabledContext";

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: SizeType;
  disabled?: boolean;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: React.CSSProperties };
}

type MergedHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLElement> &
    React.ButtonHTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLElement>,
  "type"
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: ButtonHTMLType;
}

// type CompoundedComponent = React.ForwardRefExoticComponent<
//   ButtonProps & React.RefAttributes<HTMLElement>
// > & {
//   Group: typeof Group;
//   /** @internal */
//   __ANT_BUTTON: boolean;
// };

type LoadingConfigType = {
  loading: boolean;
  delay: number;
};

function getLoadingConfig(
  loading: BaseButtonProps["loading"]
): LoadingConfigType {
  if (typeof loading === "object" && loading) {
    let delay = loading?.delay;
    delay = !Number.isNaN(delay) && typeof delay === "number" ? delay : 0;

    return {
      loading: delay <= 0,
      delay,
    };
  }

  return {
    loading: !!loading,
    delay: 0,
  };
}

const InternalButton: React.ForwardRefRenderFunction<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
> = (props, ref) => {
  const {
    loading = false,
    prefixCls: customPrefixCls,
    type = "default",
    danger,
    shape = "default",
    size = "middle",
    styles,
    disabled: customDisabled,
    className,
    rootClassName,
    children,
    icon,
    ghost = false,
    block = false,
    htmlType = "button",
    classNames: customClassNames,
    style: customStyle = {},
    ...rest
  } = props;

  const { getPrefixCls, button } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("btn", customPrefixCls); // ant-btn

  const internalRef = createRef<HTMLButtonElement | HTMLAnchorElement>();
  const buttonRef = composeRef(ref, internalRef); // ref.current | internalRef.current

  const disabled = useContext(DisabledContext);
  const mergedDisabled = disabled ?? customDisabled;

  return <button>text</button>;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  InternalButton
);

export default Button;
