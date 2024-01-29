import React from "react";
import { SeedToken } from "./seedToken";

type TokenAdditionType = {
  padding: string;
};

// ### 待改，直接使用 SeedToken
type TokenType = Partial<SeedToken & TokenAdditionType>;

// SeedToken 默认样式配置对象
export const defaultSeedToken: TokenType = {
  colorPrimary: "#1677ff",
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
