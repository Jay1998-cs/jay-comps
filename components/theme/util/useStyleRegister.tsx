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

const genStyle = (pathKeys: string[], hashId: string, styleFn: () => any) => {
  const pathKeyStr = genPathKey(pathKeys); // ujoqht%Button%jay-btn
  const styleObj = styleFn();
  const config = { hashId, path: pathKeyStr };
  const parsedStyleStr = parseStyle(styleObj, config);
  const styleId = emotionHash(pathKeyStr + parsedStyleStr);
  updateCSS(parsedStyleStr, styleId);
  console.warn("========> 插入style标签", styleId);
  return styleId;
};

/**
 * @description manipulate css style cache
 */
const CSSVarRegister: React.FC<any> = (props) => {
  const { cache } = useContext(StyleContext);

  const { info, styleFn } = props;
  const { path, hashId } = info;
  const pathKeys = [...path];

  useEffect(() => {
    // 组件生成，将 pathkey:[times, realValue] 记入缓存
    const valueFn: ValueFnType = (origin) => {
      if (!origin) {
        const styleId = genStyle(pathKeys, hashId, styleFn);
        return [1, { styleId, pathKeys }];
      } else {
        origin[0] += 1;
        return origin;
      }
    };
    cache.update(pathKeys, valueFn);

    // 组件销毁，缓存引用数量减1；若数量为0，则删除缓存对应键值和对应style标签
    const cleanup = () => {
      const cleanValueFn: ValueFnType = (origin) => {
        if (!origin) {
          // removeStyleNode(styleId); 删除缓存, 没有引用的组件
          return null;
        } else {
          origin[0] -= 1;
          if (origin[0] <= 0) {
            const styleId: string = origin[1]?.styleId || "";
            removeStyleNode(styleId);
            return null;
          }
          return origin;
        }
      };
      cache.update(pathKeys, cleanValueFn);
    };

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
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
  },
  styleFn: () => any
) {
  // 返回包裹着node的空函数组件，当渲染node时会调用useStyleRegister来注入样式
  return (node: React.ReactElement): React.JSX.Element => (
    <React.Fragment>
      <CSSVarRegister info={info} styleFn={styleFn} />
      {node}
    </React.Fragment>
  );
}
