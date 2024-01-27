import React, { useContext, useEffect } from "react";
import emotionHash from "@emotion/hash";

import { parseStyle, removeStyleNode, updateCSS } from "./styleUtil";
import StyleContext from "../StyleContext";
import { genPathKey, KeyType, ValueFnType } from "../Cache";

export type CSSVarRegisterProps = {
  pathKeys: KeyType[];
  styleId: string;
  rootCls?: string;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
};

/**
 * @description manipulate css style cache
 */
const CSSVarRegister: React.FC<CSSVarRegisterProps> = (props) => {
  const { pathKeys, styleId } = props;
  const { cache } = useContext(StyleContext);

  useEffect(() => {
    // 组件生成，将 pathkey:[times, realValue] 记入缓存
    console.log("---------------> building CSSVarRegister");

    const valueFn: ValueFnType = (origin) => {
      if (!origin) {
        console.warn("&&&初始记入缓存");
        return [1, { styleId, pathKeys }];
      } else {
        origin[0] += 1;
        console.warn("&&&缓存引用组件数量+1", cache);
        return origin;
      }
    };
    cache.update(pathKeys, valueFn);

    // 组件销毁，缓存引用数量减1；若数量为0，则删除缓存对应键值和对应style标签
    const cleanup = () => {
      console.log("---------------> destroyed CSSVarRegister");

      const valueFn: ValueFnType = (origin) => {
        if (!origin) {
          removeStyleNode(styleId);
          console.warn("@@@移除style标签, 没有引用组件", styleId);
          return null;
        } else {
          origin[0] -= 1;
          if (origin[0] <= 0) {
            removeStyleNode(styleId);
            console.warn("@@@移除style标签, 引用数为0", styleId);
            return null;
          }
          console.warn("@@@缓存引用组件数量-1", cache);
          return origin;
        }
      };
      cache.update(pathKeys, valueFn);
    };

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

/**
 * @param pathKeys (string | number) [ ]
 * @returns cache [number, any] or null
 */
const useGlobalCache = (pathKeys: KeyType[]) => {
  const { cache } = useContext(StyleContext);
  return cache.get(pathKeys);
};

/**
 * @description inject CSS to a component
 * @param info object: { token, path, hashId}
 * @param styleFn function to generate style object
 * @returns a wrapper function named WrapCSSVar, useage: WrapCSSVar(node)
 */
export default function useStyleRegister(
  info: {
    token: any;
    path: string[];
    hashId: string;
    tokenKey: string;
  },
  styleFn: () => any
) {
  const { tokenKey, path, hashId } = info;
  const pathKeys = [tokenKey, ...path];
  const pathKeyStr = genPathKey(pathKeys); // ujoqht%Button%jay-btn

  // 判断cache是否已缓存，存在则命中缓存、无需新增样式
  const cacheData = useGlobalCache(pathKeys);
  let styleId: string;

  console.error("cacheData: ", cacheData);

  if (!cacheData) {
    // 解析token获取style object，再生成css样式字符串
    const styleObj = styleFn();
    const config = { hashId, path: pathKeyStr };
    const parsedStyleStr = parseStyle(styleObj, config);
    // 创建style标签，并注入CSS样式，然后插入head
    styleId = emotionHash(pathKeyStr + parsedStyleStr);
    updateCSS(parsedStyleStr, styleId);
    console.warn("==========> 新建style标签: ", styleId);
  } else {
    const { styleId: cacheStyleId } = cacheData[1];
    styleId = cacheStyleId;
    console.warn("==========> 复用style标签: ", styleId);
  }

  // 返回包裹着node的空函数组件，当渲染node时会调用useStyleRegister来注入样式
  return (node: React.ReactElement): React.JSX.Element => (
    <React.Fragment>
      <CSSVarRegister pathKeys={pathKeys} styleId={styleId}></CSSVarRegister>
      {node}
    </React.Fragment>
  );
}
