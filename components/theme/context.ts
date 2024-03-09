import React from "react";
import { SeedToken } from "./seedToken";
import defaultSeedToken from "./seedToken";

export type TokenType = Partial<SeedToken>;

// 默认主题配置
export const defaultThemeConfig = {
  token: defaultSeedToken,
};

// token的全局上下文容器
export const DesignTokenContext = React.createContext<{
  token: TokenType;
}>(defaultThemeConfig);
