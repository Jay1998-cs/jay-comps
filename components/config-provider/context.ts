import React from "react";
import { ButtonProps } from "../button/button";

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export interface ComponentStyleConfig {
  className?: string;
  style?: React.CSSProperties;
}

export interface ButtonConfig extends ComponentStyleConfig {
  classNames?: ButtonProps["classNames"];
  styles?: ButtonProps["styles"];
}

export type DirectionType = "ltr" | "rtl" | undefined;

export const defaultIconPrefixCls = "jayicon";

// 全局上下文对象的属性
export interface ConfigConsumerProps {
  rootPrefixCls?: string;
  iconPrefixCls: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  direction?: DirectionType;
  button?: ButtonConfig;
}

// 获取类名默认前缀
const defaultGetPrefixCls = (suffixCls?: string, customPrefixCls?: string) => {
  if (customPrefixCls) {
    return customPrefixCls;
  }
  return suffixCls ? `jay-${suffixCls}` : "jay";
};

// 创建基础(只包含两个属性)全局上下文对象
export const ConfigContext = React.createContext<ConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
});

export const { Consumer: ConfigConsumer } = ConfigContext;
