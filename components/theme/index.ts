import useToken from "./useToken";
import { defaultConfig } from "./context";
import CacheEntity from "./Cache";
import { StyleProvider } from "./StyleContext";
import StyleContext from "./StyleContext";
import type { TokenType } from "./context";

const ThemeModules = {
  defaultConfig,
  defalultSeed: defaultConfig.token,

  CacheEntity,

  StyleContext,
  StyleProvider,

  useToken,
};

export default ThemeModules;

export type { TokenType };
