import React, {
  createRef,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import omit from "rc-util/lib/omit";
import { composeRef } from "rc-util/lib/ref";

import type {
  ButtonType,
  ButtonShape,
  ButtonHTMLType,
  SizeType,
} from "./buttonTypes";
import { ConfigContext } from "../config-provider/context";
import { DisabledContext } from "../config-provider/DisabledContext";
import useSize from "../config-provider/hooks/useSize";
import IconWrapper from "./IconWrapper";
import LoadingIcon from "./LoadingIcon";
import useStyle from "./style";

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

// 合并类型定义，并去除type属性类型
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

function isUnBorderedButtonType(type?: ButtonType) {
  return type === "text" || type === "link";
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
    size: customSize,
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

  const { getPrefixCls, button, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("btn", customPrefixCls); // jay-btn

  const [WrapCSSVar, cssSelectorCls] = useStyle(prefixCls);

  const internalRef = createRef<HTMLButtonElement | HTMLAnchorElement>();
  const buttonRef = composeRef(ref, internalRef); // ref.current | internalRef.current

  const disabled = useContext(DisabledContext);
  const mergedDisabled = disabled ?? customDisabled;

  const sizeClassNameMap = { large: "lg", small: "sm", middle: undefined };
  const sizeFullName = useSize((ctxSize) => customSize ?? ctxSize);
  const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] || "" : "";

  const loadingOrDelay = useMemo<LoadingConfigType>(
    () => getLoadingConfig(loading),
    [loading]
  );
  const [innerLoading, setLoading] = useState<boolean>(loadingOrDelay.loading);

  const iconType = innerLoading ? "loading" : icon;

  const linkButtonRestProps = omit(rest as ButtonProps & { navigate: any }, [
    "navigate",
  ]);

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    if (loadingOrDelay.delay > 0) {
      delayTimer = setTimeout(() => {
        delayTimer = null;
        setLoading(true);
      }, loadingOrDelay.delay);
    } else {
      setLoading(loadingOrDelay.loading);
    }

    return () => {
      if (delayTimer) {
        clearTimeout(delayTimer);
        delayTimer = null;
      }
    };
  }, [loadingOrDelay]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    const { onClick } = props;
    if (mergedDisabled) {
      e.preventDefault();
      return;
    }

    (
      onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
    )?.(e);
  };

  const classes = classNames(
    prefixCls,
    cssSelectorCls,
    className,
    rootClassName,
    button?.className,
    {
      [`${prefixCls}-${shape}`]: shape !== "default" && shape,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-danger`]: !!danger,
      [`${prefixCls}-direction`]: direction === "rtl",
    }
  );

  const fullStyle: React.CSSProperties = { ...button?.style, ...customStyle };

  const kids = children || null; // button的直接后代(数组类型)

  const iconClass = classNames(
    customClassNames?.icon,
    button?.classNames?.icon
  );
  const iconStyle: React.CSSProperties = {
    ...(styles?.icon || {}),
    ...(button?.styles?.icon || {}),
  };

  // 封装icon容器，若没有设置icon，则封装LoadingIcon容器，用于添加加载动画
  const iconNode =
    icon && !innerLoading ? (
      <IconWrapper
        prefixCls={prefixCls}
        className={iconClass}
        style={iconStyle}
      >
        {icon}
      </IconWrapper>
    ) : (
      <LoadingIcon
        existIcon={!!icon}
        prefixCls={prefixCls}
        loading={!!innerLoading}
      />
    );

  // 封装为Link Button
  if (linkButtonRestProps.href !== undefined) {
    return (
      <a
        className={classNames(classes, {
          [`${prefixCls}-disabled`]: mergedDisabled,
        })}
        {...linkButtonRestProps}
        href={mergedDisabled ? undefined : linkButtonRestProps.href}
        style={fullStyle}
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        tabIndex={mergedDisabled ? -1 : 0}
        onClick={handleClick}
      >
        {iconNode}
        {kids}
      </a>
    );
  }

  // 基础Button节点
  let buttonNode = (
    <button
      {...rest}
      type={htmlType}
      className={classes}
      style={fullStyle}
      disabled={mergedDisabled}
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      onClick={handleClick}
    >
      {iconNode}
      {kids}
    </button>
  );

  // 返回注入CSS样式的节点
  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(buttonNode);
  }

  return buttonNode;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  InternalButton
);

export default Button;
