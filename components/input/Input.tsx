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
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fillWrapper?: boolean;
  style?: React.CSSProperties;
  [key: `data-${string}`]: string | undefined;
}

type MergedInputAttributes = Omit<
  React.HTMLAttributes<HTMLElement> & React.InputHTMLAttributes<HTMLElement>,
  "size" | "prefix"
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
    prefix,
    suffix,
    fillWrapper,
    style: customStyle = {},
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
      [`${prefixCls}-outline`]: bordered && !disabled,
      [`${prefixCls}-sm`]: size === "small",
      [`${prefixCls}-lg`]: size === "large",
      [`${prefixCls}-status-error`]: status === "error",
      [`${prefixCls}-status-warning`]: status === "warning",
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-rtl`]: direction === "rtl",
    }
  );

  // >>>>> prefix & suffix
  const prefixElem = prefix ? (
    <span className={prefix ? `${prefixCls}-prefix` : ""}>{prefix}</span>
  ) : null;
  const suffixElem = suffix ? (
    <span className={suffix ? `${prefixCls}-suffix` : ""}>{suffix}</span>
  ) : null;

  // >>>>> render
  let inputNode = (
    <input
      className={inputClassName}
      ref={ref}
      style={{ ...customStyle }}
      disabled={disabled}
      {...restProps}
    />
  );

  // append prefix & suffix
  if (prefix || suffix) {
    const wrapperName = `${prefixCls}-affix-wrapper`;
    const wrapperClassName = classNames(wrapperName, hashId, {
      [`${prefixCls}-outline`]: bordered && !disabled,
      [`${prefixCls}-status-error`]: status === "error",
      [`${prefixCls}-status-warning`]: status === "warning",
      [`${wrapperName}-status-error`]: status === "error",
      [`${wrapperName}-status-warning`]: status === "warning",
      [`${wrapperName}-disabled`]: disabled,
      [`${wrapperName}-borderless`]: !bordered,
      [`${wrapperName}-fillWrapper`]: fillWrapper,
    });

    inputNode = (
      <span className={wrapperClassName}>
        {prefixElem}
        {inputNode}
        {suffixElem}
      </span>
    );
  }

  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(inputNode);
  }

  return inputNode;
});

export default Input;

// 前置后置元素、前缀后缀、status(error、warning)
