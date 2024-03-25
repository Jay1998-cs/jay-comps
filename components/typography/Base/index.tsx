import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import omit from "rc-util/lib/omit";
import copy from "copy-to-clipboard";
import useIsomorphicLayoutEffect from "rc-util/lib/hooks/useLayoutEffect";
import { isStyleSupport } from "rc-util/lib/Dom/styleChecker";
import TransButton from "../../_util/transButton";
import classNames from "classnames";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import ResizeObserver from "rc-resize-observer";

import Typography, { TypographyProps } from "../Typography";
import type { TooltipProps } from "../../tooltip";
import { ConfigContext } from "../../config-provider";
import useMergedConfig from "../hooks/useMergedConfig";
import { composeRef } from "rc-util/lib/ref";
import Ellipsis from "./Ellipsis";

export type BaseType = "secondary" | "success" | "warning" | "danger";

const ELLIPSIS_STR = "...";

interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

interface CopyConfig {
  text?: string;
  onCopy?: (event?: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  tooltips?: boolean | React.ReactNode;
  format?: "text/plain" | "text/html";
}

interface EditiConfig {
  text?: string;
  editing?: boolean;
  icon?: React.ReactNode;
  tooltip?: boolean | React.ReactNode;
  onStart?: () => void;
  onChange?: (value?: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
  maxLength?: number;
  autoSize?: boolean | AutoSizeType;
  triggerType?: ("icon" | "text")[];
  enterIcon?: React.ReactNode;
}

export interface EllipsisConfig {
  rows?: number; // 文本行数
  expandable?: boolean; // 是否展开，用于设置文本的展开or折叠状态
  suffix?: string; // 省略符号之后要显示的后缀(如suffix为'--苏轼 '， 一蓑烟雨任平生...--苏轼 )
  symbol?: React.ReactNode; // expandedIcon即展开文本的符号，默认为文本'Expand'，单击后触发expand事件
  onExpand?: React.MouseEventHandler<HTMLElement>; // 展开(显示所有)文本的回调函数
  onEllipsis?: (ellipsis: boolean) => void; // 折叠(省略某些)文本的回调函数
  tooltip?: React.ReactNode | TooltipProps;
}

export interface BlockProps<
  C extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements
> extends TypographyProps<C> {
  title?: string;
  editable?: boolean | EditiConfig;
  copyable?: boolean | CopyConfig;
  type?: BaseType;
  disabled?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  // decorations
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  keyboard?: boolean;
  italic?: boolean;
}

/**
 * @returns 若dom节点存在则返回之，否则返回defaultNode
 */
function getNode(
  dom: React.ReactNode,
  defaultNode: React.ReactNode,
  needDom?: boolean
) {
  if (dom === true || dom === undefined) {
    return defaultNode;
  }
  return dom || (needDom && defaultNode);
}

/**
 * @returns 参数转化为数组返回
 */
function toList<T extends any>(val: T | T[]): T[] {
  if (val === false) {
    return [false, false] as T[];
  }
  return Array.isArray(val) ? val : [val];
}

/**
 * @returns 若传入标记(如italic)，则返回封装后的content(如用italic标签包裹content)
 */
function wrapperDecorations(
  { mark, code, underline, delete: del, strong, keyboard, italic }: BlockProps,
  content: React.ReactNode
) {
  let currentContent = content;

  function wrap(tag: string, needed?: boolean) {
    if (!needed) {
      return;
    }

    currentContent = React.createElement(tag, {}, currentContent); // 封装content
  }

  wrap("strong", strong);
  wrap("u", underline);
  wrap("del", del);
  wrap("code", code);
  wrap("mark", mark);
  wrap("kbd", keyboard);
  wrap("i", italic);

  return currentContent;
}

////////////////////////// Base //////////////////////////
const Base = React.forwardRef<HTMLElement, BlockProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    type,
    disabled,
    children,
    ellipsis,
    editable,
    copyable,
    component,
    title,
    ...restProps
  } = props;

  // const [textLocale] = useLocale("Text");
  const { getPrefixCls, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("typography", customizePrefixCls);

  const typographyRef = useRef<HTMLElement>(null);
  // const editIconRef = useRef<HTMLDivElement>(null);

  const textProps = omit(restProps, [
    "mark",
    "code",
    "delete",
    "underline",
    "strong",
    "keyboard",
    "italic",
  ]);

  // ========================== Copyable ==========================
  const [enableCopy, copyConfig] = useMergedConfig<CopyConfig>(copyable);
  const [copied, setCopied] = useState(false);
  const copyIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyOptions: Pick<CopyConfig, "format"> = {};
  if (copyOptions.format) {
    copyOptions.format = copyConfig.format;
  }

  const cleanCopyId = () => {
    if (copyIdRef.current) {
      clearTimeout(copyIdRef.current); // 定时器引用copyIdRef.current
    }
  };

  const onCopyClick = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    copy(copyConfig.text || String(children) || "", copyOptions);
    setCopied(true);
    cleanCopyId();
    copyIdRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
    copyConfig.onCopy?.(e);
  };

  useEffect(() => cleanCopyId, []);

  // ========================== Ellipsis ==========================
  const [isLineClampSupport, setIsLineClampSupport] = useState(false);
  const [isTextOverflowSupport, setIsTextOverflowSupport] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [isJsEllipsis, setIsJsEllipsis] = useState(false);
  const [isNativeEllipsis, setIsNativeEllipsis] = useState(false);
  const [isNativeVisible, setIsNativeVisible] = useState(false);
  const [enableEllipsis, ellipsisConfig] = useMergedConfig<EllipsisConfig>(
    ellipsis,
    {
      expandable: false,
    }
  );
  const mergedEnableEllipsis = enableEllipsis && !expanded;

  const { rows = 1 } = ellipsisConfig;

  const needMeasureEllipsis = useMemo(
    () =>
      !mergedEnableEllipsis ||
      ellipsisConfig.suffix !== undefined ||
      ellipsisConfig.onEllipsis ||
      ellipsisConfig.expandable ||
      enableCopy,
    [mergedEnableEllipsis, ellipsisConfig, enableCopy]
  );

  useIsomorphicLayoutEffect(() => {
    if (enableEllipsis && !needMeasureEllipsis) {
      setIsLineClampSupport(isStyleSupport("webkitLineClamp"));
      setIsTextOverflowSupport(isStyleSupport("textOverflow"));
    }
  }, [needMeasureEllipsis, enableEllipsis]);

  const cssEllipsis = useMemo(() => {
    if (needMeasureEllipsis) {
      return false;
    }

    if (rows === 1) {
      return isTextOverflowSupport;
    }

    return isLineClampSupport;
  }, [needMeasureEllipsis, rows, isTextOverflowSupport, isLineClampSupport]);

  // const isMergedEllipsis = mergedEnableEllipsis && (cssEllipsis ? isNativeEllipsis : isJsEllipsis);
  const cssTextOverflow = mergedEnableEllipsis && rows === 1 && cssEllipsis;
  const cssLineClamp = mergedEnableEllipsis && rows > 1 && cssEllipsis;

  // >>>>> Expand
  const onExpandClick: React.MouseEventHandler<HTMLElement> = (e) => {
    setExpanded(true);
    ellipsisConfig.onExpand?.(e);
  };

  const [ellipsisWidth, setEllipsisWidth] = React.useState(0);
  const [ellipsisFontSize, setEllipsisFontSize] = React.useState(0);
  const onResize = (
    { offsetWidth }: { offsetWidth: number },
    element: HTMLElement
  ) => {
    setEllipsisWidth(offsetWidth);
    setEllipsisFontSize(
      parseInt(window.getComputedStyle?.(element).fontSize, 10) || 0
    );
  };

  // >>>>> JS Ellipsis
  const onJsEllipsis = (jsEllipsis: boolean) => {
    setIsJsEllipsis(jsEllipsis);

    if (isJsEllipsis !== jsEllipsis) {
      ellipsisConfig.onEllipsis?.(jsEllipsis); // 状态不同则触发回调
    }
  };

  // >>>>> Native Ellipsis
  useEffect(() => {
    const textEle = typographyRef.current;

    if (enableEllipsis && cssEllipsis && textEle) {
      const currentEllipsis = cssLineClamp
        ? textEle.offsetHeight < textEle.scrollHeight
        : textEle.offsetWidth < textEle.scrollWidth;
      if (isNativeEllipsis !== currentEllipsis) {
        setIsNativeEllipsis(currentEllipsis);
      }
    }
  }, [
    enableEllipsis,
    cssEllipsis,
    cssLineClamp,
    isNativeEllipsis,
    isNativeVisible, // addition
    children,
    ellipsisWidth,
  ]);

  // https://github.com/ant-design/ant-design/issues/36786
  // Use IntersectionObserver to check if element is invisible
  React.useEffect(() => {
    const textEle = typographyRef.current;
    if (
      typeof IntersectionObserver === "undefined" ||
      !textEle ||
      !cssEllipsis ||
      !mergedEnableEllipsis
    ) {
      return;
    }

    const observer = new IntersectionObserver(() => {
      setIsNativeVisible(!!textEle.offsetParent); // 文本父容器出现即可见
    });
    observer.observe(textEle!);

    return () => {
      observer.disconnect();
    };
  }, [cssEllipsis, mergedEnableEllipsis]);

  // =========================== Render ===========================
  // >>>>>>>>>>> Typography
  // Expand
  const renderExpand = () => {
    const { expandable, symbol } = ellipsisConfig;

    if (!expandable) return null;

    let expandContent: React.ReactNode = " Expand";
    if (symbol) {
      expandContent = symbol;
    }

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        key="expand"
        className={`${prefixCls}-expand`}
        onClick={onExpandClick}
        aria-label="Expand"
      >
        {expandContent}
      </a>
    );
  };

  // Copy
  const renderCopy = () => {
    if (!enableCopy) {
      return null;
    }

    const { icon, tooltips } = copyConfig;

    const iconNodes = toList(icon);
    const copyTitle = tooltips || "copy";
    const systemStr = "copy";
    const ariaLabel = typeof copyTitle === "string" ? copyTitle : systemStr;

    const classes = classNames(`${prefixCls}-copy`, {
      [`${prefixCls}-copy-success`]: copied,
      [`${prefixCls}-copy-icon-only`]:
        children === null || children === undefined,
    });

    return (
      <TransButton
        key={String(Math.random()).slice(-8)}
        className={classes}
        onClick={onCopyClick}
        aria-label={ariaLabel}
      >
        {copied
          ? getNode(iconNodes[1], <CheckOutlined />, true)
          : getNode(iconNodes[0], <CopyOutlined />, true)}
      </TransButton>
    );
  };

  const renderOperations = (renderExpanded: boolean) => [
    renderExpanded && renderExpand(),
    renderCopy(),
    // renderEdit(),
  ];

  const renderEllipsis = (needEllipsis: boolean) => [
    needEllipsis && (
      <span aria-hidden key="ellipsis">
        {ELLIPSIS_STR}
      </span>
    ),
    ellipsisConfig.suffix,
    renderOperations(needEllipsis),
  ];

  // >>>>> Base
  const typographyClasses = classNames(className, {
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-ellipsis`]: enableEllipsis,
    [`${prefixCls}-single-line`]: mergedEnableEllipsis && rows === 1,
    [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow,
    [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp,
  });
  const typographyStyle: React.CSSProperties = {
    ...style,
    WebkitLineClamp: cssLineClamp ? rows : undefined,
  };

  // 回调函数,
  const ellipsisChildren = (node: React.ReactNode, needEllipsis: boolean) => {
    let renderNode: React.ReactNode = node;
    const noLengthAttr =
      node === null ||
      node === undefined ||
      typeof node === "boolean" ||
      typeof node === "symbol";

    if (!noLengthAttr && needEllipsis) {
      renderNode = (
        <span key="show-content" aria-hidden>
          {renderNode}
        </span>
      ); // 文本节点
    }

    // 装饰node(如封装strong、italic等装饰标签)
    const wrappedContext = wrapperDecorations(
      props,
      <>
        {renderNode}
        {renderEllipsis(needEllipsis)}
      </>
    );

    return wrappedContext;
  };

  return (
    <ResizeObserver onResize={onResize} disabled={!mergedEnableEllipsis}>
      {(resizeRef: React.RefObject<HTMLElement>) => (
        <Typography
          className={typographyClasses}
          prefixCls={customizePrefixCls}
          component={component}
          ref={composeRef(resizeRef, typographyRef, ref)}
          direction={direction}
          title={title}
          style={typographyStyle}
          {...textProps}
        >
          <Ellipsis
            enabledMeasure={mergedEnableEllipsis && !cssEllipsis}
            text={children}
            rows={rows}
            width={ellipsisWidth}
            fontSize={ellipsisFontSize}
            onEllipsis={onJsEllipsis}
          >
            {ellipsisChildren}
          </Ellipsis>
        </Typography>
      )}
    </ResizeObserver>
  );
});

export default Base;
