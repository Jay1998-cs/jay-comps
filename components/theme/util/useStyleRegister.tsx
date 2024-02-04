import React, { useContext, useEffect, useState } from "react";
import emotionHash from "@emotion/hash";

import { parseStyle, removeStyleNode, updateCSS } from "./styleUtil";
import StyleContext from "../StyleContext";
import { genPathKey, KeyType } from "../Cache";

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
 *
 * @param pathKeys [tokenKey, component, prefixCls]
 * @param cssSelectorCls 选择器类名
 * @param styleFn CSS样式对象组成的数组
 * @returns 返回style标签的data-css-hash属性值
 */
const genStyle = (
  pathKeys: string[],
  cssSelectorCls: string,
  styleFn: () => any
) => {
  const pathKeyStr = genPathKey(pathKeys); // ujoqht%Button%jay-btn
  const styleObj = styleFn();
  const config = { cssSelectorCls, path: pathKeyStr };
  const parsedStyleStr = parseStyle(styleObj, config);
  const styleId = emotionHash(pathKeyStr + parsedStyleStr); // style标签的data-css-hash属性值
  updateCSS(parsedStyleStr, styleId);

  return styleId;
};

/**
 * @description manipulate css style
 */
const CSSVarRegister: React.FC<any> = (props) => {
  const { cache } = useContext(StyleContext);

  const { info, styleFn } = props;
  const { path, cssSelectorCls } = info;
  const pathKeys = [...path]; // [tokenKey, component, prefixCls]
  const tokenKey = path[0];
  const [cachePathKeys, setCachePathKeys] = useState<KeyType[]>([]);

  /**
   * 监听当前样式标识tokenKey，其变化时，表示组件的样式发生更新
   * (1)根据tokenKey获取样式缓存origin；若不存在，则新建style标签;
   * (2)若存在样式缓存，则缓存记录的引用组件数量+1;
   * (3)原组件样式缓存(cachePathKeys记录历史缓存标识)引用数量-1，若引用数为0，则删除对应style标签。
   */
  useEffect(() => {
    // console.log("\n####### tokenKey Effect ######### \n\n");

    // 步骤(3) 注: tokenKey变动时才修改缓存数据; 需放在前两个步骤之前, 因为前面步骤操作cache影响判断
    if (tokenKey !== cachePathKeys[0]) {
      cache.update(cachePathKeys, (origin = null) => {
        // console.error("origin: ", origin);
        if (origin) {
          origin[0] -= 1;
          // console.error("**【原先缓】存引用数-1: ", origin);
          if (origin[0] <= 0) {
            const styleId: string = origin[1]?.styleId || "";
            removeStyleNode(styleId);
            // console.warn("**【原缓存】引用数为0, 删除原缓存及移除style标签");
            return null;
          }
        }
        return origin;
      });
    }

    // 步骤(1)(2)
    cache.update(pathKeys, (origin) => {
      if (!origin) {
        const styleId = genStyle(pathKeys, cssSelectorCls, styleFn); // 新建样式标签
        // console.warn("==> tokenKey【新建】style标签和初始化缓存:\n ", cache);
        setCachePathKeys(pathKeys); // 记录缓存路径
        return [1, { styleId, pathKeys }]; // 引用数为1，当前组件使用该样式
      } else {
        origin[0] += 1; // 样式已存在，引用它的组件数量加1
        // console.warn("==> tokenKey新增【引用】组件\n ", cache);
        setCachePathKeys(pathKeys);
        return origin;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenKey]);

  // 组件销毁，缓存引用数量减1；若数量为0，则删除缓存对应键值和对应style标签
  useEffect(() => {
    return () => {
      cache.update(pathKeys, (origin) => {
        if (!origin) {
          // console.warn("##【组件卸载】无缓存, 返回null", pathKeys);
          return null;
        } else {
          // console.error("【组件卸载】引用减少前", origin);
          origin[0] -= 1;
          if (origin[0] <= 0) {
            const styleId: string = origin[1]?.styleId || "";
            // console.warn("##【组件卸载】引用数减为0, 删除缓存及移除style标签");
            removeStyleNode(styleId);
            return null;
          }
          // console.warn("##【组件卸载】缓存引用数-1", cache);
          return origin;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

/**
 * @description inject CSS to a component
 * @param info object: { token, path, hashId}
 * @param styleFn function to generate style object
 * @returns a wrapper function named WrapCSSVar(), useage: WrapCSSVar(node)
 */
export default function useStyleRegister(
  info: {
    token: any;
    path: string[];
    cssSelectorCls: string;
  },
  styleFn: () => any
) {
  // 返回包裹node的空函数组件，CSSVarRegister组件与node生命周期相同，以控制node样式
  return (node: React.ReactElement): React.JSX.Element => (
    <React.Fragment>
      <CSSVarRegister info={info} styleFn={styleFn} />
      {node}
    </React.Fragment>
  );
}
