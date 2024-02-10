import React from "react";
import { SeedToken } from "./seedToken";
import defaultSeedToken from "./seedToken";

export type TokenType = Partial<SeedToken>;

// token context 的默认配置
export const defaultConfig = {
  token: defaultSeedToken,
};

// token的全局上下文容器
export const DesignTokenContext = React.createContext<{
  token: TokenType;
}>(defaultConfig);
