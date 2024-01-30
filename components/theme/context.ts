import React from "react";
import { SeedToken } from "./seedToken";

type TokenAdditionType = {
  padding: string;
  color: string;
};

// ### 待改，直接使用 SeedToken
export type TokenType = Partial<SeedToken & TokenAdditionType>;

// SeedToken 默认样式配置对象
export const defaultSeedToken: TokenType = {
  colorPrimary: "rgba(20,120,255)",
  colorBgBase: "rgba(255,255,255)",
  colorInfo: "rgba(0,0,0)",
  border: "1px solid rgba(0,0,0)",
  borderRadius: 6,
  padding: "4px 16px",
};

// token context 的默认配置
export const defaultConfig = {
  token: defaultSeedToken,
};

// token的全局上下文容器
export const DesignTokenContext = React.createContext<{
  token: TokenType;
}>(defaultConfig);
