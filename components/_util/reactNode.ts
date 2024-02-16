import React from "react";
import type { AnyObject } from "./type";

type RenderProps = AnyObject | ((originProps: AnyObject) => AnyObject | void);

export const { isValidElement } = React;

/**
 * @returns 判断child是否为React.Frament类型
 */
export function isFragment(child: any): boolean {
  return child && isValidElement(child) && child.type === React.Fragment;
}

/**
 * @returns 若element不合法则返回replaceElement；否则，返回包含props克隆的element
 */
export function replaceElement(
  element: React.ReactNode,
  replaceElement: React.ReactNode,
  props?: RenderProps
): React.ReactNode {
  if (!isValidElement(element)) {
    return replaceElement;
  }

  return React.cloneElement(
    element,
    typeof props === "function" ? props(element.props || {}) : props
  );
}

/**
 * @returns 返回包含props克隆的element
 */
export function cloneElement(
  element: React.ReactNode,
  props?: RenderProps
): React.ReactElement {
  return replaceElement(element, element, props) as React.ReactElement;
}

/**
 * @returns 若不是undefined、null和空串则返回true
 */
export function hasContent(target: React.ReactNode): boolean {
  const isEmptyStr = typeof target === "string" && target.trim() === "";

  return target !== undefined && target !== null && !isEmptyStr;
}
