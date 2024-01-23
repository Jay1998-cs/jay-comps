import React from "react";
import { SeedToken } from "./seedToken";

// #### 待改，直接使用 SeedToken
type TokenType = Partial<SeedToken>;

// 默认样式配置对象
export const defaultSeedToken: TokenType = {
  colorPrimary: "#1677ff",
  borderRadius: 6,
};

// context默认配置
export const defaultConfig = {
  token: defaultSeedToken,
};

// context
export const DesignTokenContext = React.createContext<{
  token: TokenType;
}>(defaultConfig);
