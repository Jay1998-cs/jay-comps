import React from "react";
import CacheEntity from "./Cache";

function createCache() {
  return new CacheEntity(Math.random().toString(12).slice(2));
}

export interface StyleContextProps {
  cache: CacheEntity;
  defaultCache: boolean;
  autoClear?: boolean;
}

export type StyleProviderProps = Partial<StyleContextProps> & {
  children?: React.ReactNode;
};

const StyleContext = React.createContext<StyleContextProps>({
  cache: createCache(),
  defaultCache: true,
});

export const StyleProvider: React.FC<StyleProviderProps> = (props) => {
  const { children, ...restProps } = props;

  const parentContext = React.useContext(StyleContext);

  const context = React.useMemo(() => {
    // 默认context
    const mergedContext: StyleContextProps = {
      ...parentContext,
    };
    // StyleProvider定义的相关属性，添加到mergedContext
    (Object.keys(restProps) as (keyof StyleContextProps)[]).forEach((key) => {
      const val = restProps[key];
      if (val !== undefined) {
        (mergedContext as any)[key] = val;
      }
    });

    const { cache } = restProps;
    mergedContext.cache = mergedContext.cache || createCache();
    mergedContext.defaultCache = !cache && parentContext.defaultCache;

    return mergedContext;
  }, [parentContext, restProps]);

  return (
    <StyleContext.Provider value={context}>{children}</StyleContext.Provider>
  );
};

export default StyleContext;
