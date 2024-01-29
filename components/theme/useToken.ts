import React from "react";
import emotionHash from "@emotion/hash";

// import { SeedToken } from "./seedToken";
import { DesignTokenContext, defaultSeedToken } from "./context";

// 将token的所有值拼接为一个字符串返回，用于生成hashId
function flattenTokenToStr(token: any): string {
  let str = "";

  Object.keys(token).forEach((key) => {
    const val = token[key];
    if (val && typeof val === "object") {
      str += flattenTokenToStr(val);
    } else {
      str += val;
    }
  });

  return str;
}

// 根据token对象生成哈希值字符串
function token2key(token: any, component: string): string {
  const tokenStr = flattenTokenToStr(token);
  const str = `${tokenStr}_${component}`;
  return emotionHash(str);
}

// 类型声明
type TokenInfoType = [theme: any, cssSelectorCls: string, tokenKey: string];

/**
 *
 * @param component 组件名(string), 如'Button'
 * @returns 返回组件的样式配置对象token，它合并了默认和上层(最近祖先)的token
 */
export default function useToken(component: string): TokenInfoType {
  // 获取上层token
  const { token: rootDesignToken } = React.useContext(DesignTokenContext);
  // 合并默认和上层token
  const mergedToken = React.useMemo(
    () => Object.assign({}, defaultSeedToken, rootDesignToken) as any,
    [rootDesignToken]
  );
  // 生成tokenKey，用于标识组件的CSS选择器和生成style标签的id
  const tokenKey = token2key(mergedToken, component);
  // 组件对应style标签的选择器名称
  const cssSelectorCls = `css-dev-only-do-not-override-${tokenKey}`;

  return [mergedToken, cssSelectorCls ? cssSelectorCls : "", tokenKey];
}
