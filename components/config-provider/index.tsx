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
    [parentContext, prefixCls]
  );

  // 获取主题对象theme，包含token属性
  const mergedTheme = useTheme(theme, parentContext.theme);

  // 提取、缓存主题配置
  const memoTheme = React.useMemo(() => {
    const { token, ...rest } = mergedTheme || {};
    return {
      token: {
        // 合并默认token与自定义主题token
        ...defaultSeedToken,
        ...token, // 注: 自定义优先, 故位置在后
      },
      ...rest,
    };
  }, [mergedTheme]);

  // 合并组件配置和父级配置到config对象(重点为theme属性)
  const config = { ...parentContext };
  const baseConfig = {
    getPrefixCls,
    theme: mergedTheme,
    direction,
  };
  Object.keys(baseConfig).forEach((key: keyof typeof baseConfig) => {
    if (baseConfig[key] !== undefined) {
      (config as any)[key] = baseConfig[key];
    }
  });

  // DesignTokenContext.Provider封装children, 传递theme使后代能获取到token(如useToken)
  let childNode = children;
  if (theme) {
    childNode = (
      <DesignTokenContext.Provider value={memoTheme}>
        {childNode}
      </DesignTokenContext.Provider>
    );
  }

  // 返回ConfigProvider容器组件(ConfigContext.Provider包裹使后代能使用context即调用useContext)
  return (
    <ConfigContext.Provider value={config}>{childNode}</ConfigContext.Provider>
  );
};

// 组件样式生效容器, props包含自定义主题对象theme, 而theme中含样式配置对象token
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
