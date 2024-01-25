import React from "react";

import { mergedTokenType } from "../useToken";
import { parseStyle, uniqueHash, updateCSS } from "./styleUtil";

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
  const styleObj = styleFn();

  const config = {
    hashId,
    path: path.join("-"),
  };
  const parsedStyleStr = parseStyle(styleObj, config);
  const styleId = uniqueHash(fullPath, parsedStyleStr);
  updateCSS(parsedStyleStr, styleId);

  return (node: React.ReactElement): React.JSX.Element => (
    <React.Fragment>{node}</React.Fragment>
  );
}
