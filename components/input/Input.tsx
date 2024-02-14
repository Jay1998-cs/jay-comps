import React, { forwardRef, useContext } from "react";
import classNames from "classnames";

import { SizeType } from "../config-provider/SizeContext";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";

const InputStatuses = ["warning", "error", ""] as const;
export type InputStatus = (typeof InputStatuses)[number];

export interface InternalInputProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  size?: SizeType;
  disabled?: boolean;
  status?: InputStatus;
  bordered?: boolean;
  style?: React.CSSProperties;
  [key: `data-${string}`]: string | undefined;
}

type MergedInputAttributes = Omit<
  React.HTMLAttributes<HTMLElement> & React.InputHTMLAttributes<HTMLElement>,
  "size"
>;

// export type InputProps = InternalInputProps & MergedInputAttributes;
export interface InputProps extends InternalInputProps, MergedInputAttributes {}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    size,
    disabled,
    status,
    bordered = true,
    style = {},
    ...restProps
  } = props;

  const { getPrefixCls, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("input", customizePrefixCls);

  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // >>>>> className
  const inputClassName = classNames(
    prefixCls,
    className,
    rootClassName,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-sm`]: size === "small",
      [`${prefixCls}-lg`]: size === "large",
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-rtl`]: direction === "rtl",
    }
  );

  // >>>>> render
  const inputNode = (
    <input
      className={inputClassName}
      ref={ref}
      style={style}
      disabled={disabled}
      {...restProps}
    />
  );

  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(inputNode);
  }

  return inputNode;
});

export default Input;

// 前置后置元素、前缀后缀、status(error、warning)
