import { defaultConfig } from "./context";
import CacheEntity from "./Cache";
import { StyleProvider } from "./StyleContext";
import StyleContext from "./StyleContext";
import type { TokenType } from "./context";
import { SeedToken } from "./seedToken";

const ThemeModules = {
  defaultConfig,
  defalultSeed: defaultConfig.token,

  CacheEntity,

  StyleContext,
  StyleProvider,
};
export default ThemeModules;

export type { TokenType, SeedToken };

export { default as genComponentStyleHook } from "./util/genComponentStyleHook";
export { default as useToken } from "./useToken";
