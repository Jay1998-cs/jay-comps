import React from "react";
import { SeedToken } from "./seedToken";

// #### 待改，直接使用 SeedToken
type TokenType = Partial<SeedToken>;

// SeedToken 默认配置
export const defaultSeedToken: TokenType = {
  colorPrimary: "#1677ff",
  borderRadius: 6,
};

// token context 的默认配置
export const defaultConfig = {
  token: defaultSeedToken,
};

// token的全局上下文容器
export const DesignTokenContext = React.createContext<{
  token: TokenType;
}>(defaultConfig);
