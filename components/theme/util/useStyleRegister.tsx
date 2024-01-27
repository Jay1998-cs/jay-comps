import React, { useContext, useEffect } from "react";

import { mergedTokenType } from "../useToken";
import {
  parseStyle,
  removeStyleNode,
  uniqueHash,
  updateCSS,
} from "./styleUtil";
import StyleContext from "../StyleContext";
import { pathKey } from "../Cache";

export type CSSVarRegisterProps = {
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
  const { styleId } = props;

  useEffect(() => {
    console.log("---------------> building CSSVarRegister");

    return () => {
      // 组件销毁，处理组件对应的style标签(若其他组件也引用则保留相关style)
      // 不能直接移除style标签，因为可能其他组件在引用
      // removeStyleNode(styleId);
      console.log("---------------> destroyed CSSVarRegister");
    };
  }, [styleId]);

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
    token: mergedTokenType;
    path: string[];
    hashId?: string;
  },
  styleFn: () => any
) {
  const { token, path, hashId } = info;
  const tokenKey = token._tokenKey ?? "";
  const fullPath = [tokenKey, ...path];
  const fullPathStr = pathKey(fullPath); // ujoqht%Button%jay-btn

  const styleObj = styleFn();
  const config = { hashId, path: fullPathStr };
  const parsedStyleStr = parseStyle(styleObj, config);
  const styleId = uniqueHash(fullPath, parsedStyleStr);

  // 创建style标签，并注入CSS样式，然后插入head中
  updateCSS(parsedStyleStr, styleId);

  return (node: React.ReactElement): React.JSX.Element => (
    <React.Fragment>
      <CSSVarRegister styleId={styleId}></CSSVarRegister>
      {node}
    </React.Fragment>
  );
}
