import React from "react";

import type {
  ThemeConfig,
  DirectionType,
  defaultIconPrefixCls,
} from "./context";
import useTheme from "./hooks/useTheme";
import { DesignTokenContext, defaultSeedToken } from "../theme/context";
import { ConfigConsumerProps, ConfigConsumer, ConfigContext } from "./context";

// context的基础属性
export interface ConfigProviderProps {
  theme?: ThemeConfig;
  prefixCls?: string;
  direction?: DirectionType;
  children?: React.ReactNode;
}

// Children Provider Props
interface ProdiverChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps;
}

// 组件样式注入容器 Provider
const ProdviderChildren: React.FC<ProdiverChildrenProps> = (props) => {
  const { theme, prefixCls, direction, children, parentContext } = props;

  // 获取ClassName的前缀（例如，返回值为"ant-"）
  const getPrefixCls = React.useCallback(
    (suffixCls: string, customizePrefixCls?: string) => {
      if (customizePrefixCls) {
        return customizePrefixCls;
      }
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls("");
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
    },
    [parentContext.getPrefixCls, prefixCls]
  );

  // 获取主题对象，包含token属性，即样式配置对象
  const mergedTheme = useTheme(theme, parentContext.theme);

  // 提取主题配置
  const memoTheme = React.useMemo(() => {
    const { token, ...rest } = mergedTheme || {};
    return {
      token: {
        ...defaultSeedToken,
        ...token,
      },
      ...rest,
    };
  }, [mergedTheme]);

  // 合并组件配置和父级配置到config对象
  const baseConfig = {
    getPrefixCls,
    theme: mergedTheme,
    direction,
  };
  const config = { ...parentContext };
  Object.keys(baseConfig).forEach((key: keyof typeof baseConfig) => {
    if (baseConfig[key] !== undefined) {
      (config as any)[key] = baseConfig[key];
    }
  });

  // 通过ConfigProvider插入主题样式
  let childNode = children;
  if (theme) {
    childNode = (
      <DesignTokenContext.Provider value={memoTheme}>
        {childNode}
      </DesignTokenContext.Provider>
    );
  }

  // 返回ConfigProvider容器组件
  return (
    <ConfigContext.Provider value={config}>{childNode}</ConfigContext.Provider>
  );
};

// 组件样式生效容器 Consumer
const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  return (
    <ConfigConsumer>
      {(context) => <ProdviderChildren parentContext={context} {...props} />}
    </ConfigConsumer>
  );
};

export default ConfigProvider;

export {
  ConfigConsumer,
  ConfigContext,
  defaultIconPrefixCls,
  type ThemeConfig,
  type ConfigConsumerProps,
  type DirectionType,
};
