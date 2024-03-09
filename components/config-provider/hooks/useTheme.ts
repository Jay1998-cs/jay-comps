import type { ThemeConfig } from "../context";
import { defaultThemeConfig } from "../../theme/context";

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
  const componentThemeConfig = theme || {};
  const parentThemeConfig = parentTheme || defaultThemeConfig;

  // return React.useMemo<ThemeConfig | undefined>(() => {
  // 组件未设置主题，则使用父或默认主题
  if (!theme) {
    return parentTheme;
  }

  // 组件设置主题，合并主题，且最近(组件主题)优先
  return {
    // 合并属性，就近优先(componentThemeConfig在后)
    ...parentThemeConfig,
    ...componentThemeConfig,
    // 合并样式配置对象
    token: {
      ...parentThemeConfig.token,
      ...componentThemeConfig.token,
    },
  };
  // }, [themeConfig, parentThemeConfig]);
}
