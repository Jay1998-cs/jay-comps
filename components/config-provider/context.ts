import React from "react";
import { ButtonProps } from "../button/button";
import { SeedToken } from "../theme/seedToken";
import { FlexProps } from "../flex";

export type DirectionType = "ltr" | "rtl" | undefined;

export const defaultIconPrefixCls = "jayicon";

//////////////////////////////////////////////////////////////////////////////
// 主题
export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

// 主题配置
export interface ThemeConfig {
  token?: Partial<SeedToken>; //【组件的样式配置对象】
  hashed?: boolean;
  inherit?: boolean;
  cssVar?: { prefix?: string; key?: string } | boolean;
}

//////////////////////////////////////////////////////////////////////////////
// Component基础样式配置
export interface ComponentStyleConfig {
  className?: string;
  style?: React.CSSProperties;
}

// Button
export interface ButtonConfig extends ComponentStyleConfig {
  classNames?: ButtonProps["classNames"];
  styles?: ButtonProps["styles"];
}

// Flex
export interface FlexConfig extends ComponentStyleConfig {
  vertical?: FlexProps["vertical"];
}

//////////////////////////////////////////////////////////////////////////////
// 获取ClassName的默认前缀
const defaultGetPrefixCls = (suffixCls?: string, customPrefixCls?: string) => {
  if (customPrefixCls) {
    return customPrefixCls;
  }
  return suffixCls ? `jay-${suffixCls}` : "jay-comp";
};

//////////////////////////////////////////////////////////////////////////////
// 全局上下文对象 ConfigConsumer 的属性
export interface ConfigConsumerProps {
  // global config
  rootPrefixCls?: string;
  iconPrefixCls: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  theme?: ThemeConfig; //【定制主题】
  direction?: DirectionType;

  // component config
  button?: ButtonConfig;
  typography?: ComponentStyleConfig;
  flex?: FlexConfig;
  spin?: ComponentStyleConfig;
}

// 全局上下文对象 ConfigContext
export const ConfigContext = React.createContext<ConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls, // 获取ClassName默认前缀的方法，jay-
  iconPrefixCls: defaultIconPrefixCls, // icon的ClassName默认前缀，jayicon
});

export const ConfigConsumer = ConfigContext.Consumer;
