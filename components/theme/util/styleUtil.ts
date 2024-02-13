import { AnimationConfigType } from "../../style/animations";

export interface ParseConfig {
  cssSelectorCls?: string;
  path?: string;
}

export type ContainerType = Element | ShadowRoot;

export const attributeName = "data-css-hash";

// 返回CSS样式选择器，形如:where(selector).className
export function injectHashSelector(className: string, hashId: string) {
  if (!hashId) return className;

  if (className !== "" && className.trim().startsWith("@media")) {
    return className;
  }

  return `:where(.${hashId})${className}`;
}

// 解析、返回CSS样式字符串
export function parseStyle(
  interpolation: any[],
  config: ParseConfig = {},
  root: boolean = true
): string {
  const { cssSelectorCls = "" } = config;
  let styleStr = "";

  interpolation.forEach((originStyle) => {
    if (typeof originStyle === "string") {
      styleStr += `${originStyle}\n`;
    } else if (typeof originStyle === "object") {
      Object.keys(originStyle).forEach((key) => {
        const val = originStyle[key];
        if (typeof val === "object") {
          const mergedKey = injectHashSelector(key, cssSelectorCls);
          const parsedStr = parseStyle([val], config, false);
          styleStr += `${mergedKey}${parsedStr}`;
        } else {
          const styleName = key.replace(
            /[A-Z]/g,
            (match) => `-${match.toLowerCase()}`
          );
          const actualVal =
            typeof val === "number" && val !== 0 ? `${val}px` : val;
          styleStr += `${styleName}:${actualVal};`;
        }
      });
    }
  });

  if (!root) {
    styleStr = `{${styleStr}}`;
  }

  return styleStr;
}

// 获取页面head或body标签
function getContainer(): HTMLElement {
  return document.querySelector("head") || document.body;
}

// 获取所有style元素
export function findStyles(container: ContainerType) {
  return Array.from(container.children).filter(
    (node) => node.tagName.toLowerCase() === "style"
  ) as HTMLStyleElement[];
}

// 获取key对应的style节点
export function findStyleNode(key: string) {
  const container = getContainer();
  return findStyles(container).find(
    (node) => node.getAttribute(attributeName) === key
  );
}

// 移除key对应的style节点
export function removeStyleNode(key: string) {
  const container = getContainer();
  findStyles(container).forEach((styleNode) => {
    if (styleNode.getAttribute(attributeName) === key) {
      // console.error("**移除style标签:", styleNode, data ?? data);
      container.removeChild(styleNode);
    }
  });
}

// 创建style节点并注入CSS样式
export function injectCSS(css: string) {
  const styleNode = document.createElement("style");
  styleNode.innerHTML = css;
  const container = getContainer();
  container.appendChild(styleNode);

  return styleNode;
}

// 将animation代码插入style标签
function injectAnimation(
  style: HTMLStyleElement,
  animationConfig: AnimationConfigType
) {
  if (typeof animationConfig !== "object") {
    return;
  }

  const animations = Object.values(animationConfig).join(" ");
  if (animations === "") {
    return;
  }

  style.innerHTML = `${animations} ${style.innerHTML}`;
}

// 获取已存在的style节点，没有则创建新节点，并且注入最新CSS样式
export function updateCSS(
  css: string,
  hashId: string,
  animationConfig: AnimationConfigType
) {
  // 若样式节点已存在，且样式已更新，则更新样式节点
  const existStyleNode = findStyleNode(hashId);
  if (existStyleNode) {
    if (existStyleNode.innerHTML !== css) {
      existStyleNode.innerHTML = css;
    }
    return;
  }
  // 样式节点不存在，创建样式节点并注入CSS样式字符串
  const styleNode = injectCSS(css);
  // 为特定组件在style标签中添加animation
  injectAnimation(styleNode, animationConfig);
  // 为样式节点设置标识属性
  styleNode.setAttribute(attributeName, hashId);
  return styleNode;
}
