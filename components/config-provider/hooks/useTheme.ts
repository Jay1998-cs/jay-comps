import type { ThemeConfig } from "../context";
import { defaultConfig } from "../../theme/context";

/**
 * @description 获取组件的主题对象，它包含组件的样式配置对象属性token
 * @param theme ThemeConfig
 * @param parentTheme ThemeConfig
 * @returns ThemeConfig | undefined
 */
export default function useTheme(
  theme?: ThemeConfig,
  parentTheme?: ThemeConfig
): ThemeConfig | undefined {
  // 获取组件、上层(默认)主题
  const themeConfig = theme || {};
  const parentThemeConfig = parentTheme || defaultConfig;

  // return React.useMemo<ThemeConfig | undefined>(() => {
  // 组件未设置主题，则使用父或默认主题
  if (!theme) {
    return parentTheme;
  }

  // 组件设置主题，合并主题，且最近(组件主题)优先
  return {
    ...parentThemeConfig,
    ...themeConfig,
    token: {
      ...parentThemeConfig.token,
      ...themeConfig.token,
    },
  };
  // }, [themeConfig, parentThemeConfig]);
}
