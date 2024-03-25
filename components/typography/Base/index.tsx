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
  const [enableCopy, copyConfig] = useMergedConfig<CopyConfig>(copyable); // 是否可复制文本，默认false
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
  const [isLineClampSupport, setIsLineClampSupport] = useState(false); // 是否支持CSS的 -webkit-line-clamp 属性
  const [isTextOverflowSupport, setIsTextOverflowSupport] = useState(false); // 是否支持CSS的 text-overflow 属性

  const [expanded, setExpanded] = useState(false); // 默认为false即不展开所有文本，单击expandIcon可切换true或false
  const [isJsEllipsis, setIsJsEllipsis] = useState(false); // 文本的省略内容改动，需要重新计算(如rows增加或减少时)
  const [isNativeEllipsis, setIsNativeEllipsis] = useState(false);
  const [isNativeVisible, setIsNativeVisible] = useState(false);
  const [enableEllipsis, ellipsisConfig] = useMergedConfig<EllipsisConfig>(
    ellipsis,
    {
      expandable: false,
    }
  );
  const mergedEnableEllipsis = enableEllipsis && !expanded; // 是否需要开启文本省略（默认为true）

  const { rows = 1 } = ellipsisConfig; // 从props.ellipsis中获取文本要显示的行数(默认为1)

  // 是否需要计算省略相关信息（初始情况为false）
  const needMeasureEllipsis = useMemo(
    () =>
      !mergedEnableEllipsis ||
      ellipsisConfig.suffix !== undefined ||
      ellipsisConfig.onEllipsis ||
      ellipsisConfig.expandable ||
      enableCopy,
    [mergedEnableEllipsis, ellipsisConfig, enableCopy]
  );

  // 开启省略且无需计算时，查询浏览器是否支持CSS实现省略的相关属性
  useIsomorphicLayoutEffect(() => {
    if (enableEllipsis && !needMeasureEllipsis) {
      setIsLineClampSupport(isStyleSupport("webkitLineClamp"));
      setIsTextOverflowSupport(isStyleSupport("textOverflow"));
    }
  }, [needMeasureEllipsis, enableEllipsis]);

  // 是否能够采用CSS的方式实现单行or多行文本溢出省略
  const cssEllipsis = useMemo(() => {
    if (needMeasureEllipsis) {
      // 涉及计算操作时不能使用CSS实现文本溢出省略
      return false;
    }
    if (rows === 1) {
      // 单行文本时，若浏览器支持CSS的text-overflow属性，则可以使用该CSS方法实现【单行】文本溢出省略
      return isTextOverflowSupport;
    }
    // 多行文本时，若浏览器支持CSS的-webkit-line-clamp属性，则可以使用该CSS方法实现【多行】文本溢出省略
    return isLineClampSupport;
  }, [needMeasureEllipsis, rows, isTextOverflowSupport, isLineClampSupport]);

  const cssTextOverflow = mergedEnableEllipsis && rows === 1 && cssEllipsis;
  const cssLineClamp = mergedEnableEllipsis && rows > 1 && cssEllipsis;
  // const isMergedEllipsis = mergedEnableEllipsis && (cssEllipsis ? isNativeEllipsis : isJsEllipsis);

  // click展开按钮事件处理函数，显示所有文本(不省略或折叠)
  const onExpandClick: React.MouseEventHandler<HTMLElement> = (e) => {
    setExpanded(true);
    ellipsisConfig.onExpand?.(e);
  };

  // 处理文本的父容器窗口尺寸变化即resize事件(首次加载会触发)，记录相关state
  const [ellipsisWidth, setEllipsisWidth] = React.useState(0); // 文本父容器的布局宽度(不含margin)
  const [ellipsisFontSize, setEllipsisFontSize] = React.useState(0); // 文本的字体大小(如14px)

  const onResize = (
    { offsetWidth }: { offsetWidth: number },
    element: HTMLElement
  ) => {
    // 监听文本父容器尺寸变化，更新ellipsisWidth和ellipsisFontSize
    setEllipsisWidth(offsetWidth);
    setEllipsisFontSize(
      parseInt(window.getComputedStyle?.(element).fontSize, 10) || 0
    );
  };

  //【JS Ellipsis】事件回调函数，当 jsEllipsis 状态变化时(如展开或折叠文本)，触发onEllipsis回调函数
  const onJsEllipsis = (jsEllipsis: boolean) => {
    setIsJsEllipsis(jsEllipsis);

    if (isJsEllipsis !== jsEllipsis) {
      // jsEllipsis状态变化 -> 触发回调onEllipsis
      ellipsisConfig.onEllipsis?.(jsEllipsis);
    }
  };

  // 【Native Ellipsis Effect】用于更新 isNativeEllipsis 状态(通常为false)
  useEffect(() => {
    const textEle = typographyRef.current; // 文本的父容器节点

    if (enableEllipsis && cssEllipsis && textEle) {
      // 可以采用CSS方法实现文本溢出隐藏(此时if中的cssEllipsis为true)
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
    isNativeVisible, // (暂时无用，可删除)
    children,
    ellipsisWidth,
  ]);

  // https://github.com/ant-design/ant-design/issues/36786
  // Use IntersectionObserver to check if element is invisible
  // 查阅文本节点(typographyRef.current)是否可见
  useEffect(() => {
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
      // 如果元素是隐藏的，则textEle.offsetParent为null，否则说明元素可见
      setIsNativeVisible(!!textEle.offsetParent);
    });
    observer.observe(textEle!);

    return () => {
      observer.disconnect();
    };
  }, [cssEllipsis, mergedEnableEllipsis]);

  // =========================== Generate Content ===========================
  // Expand Node
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

  // Copy Node
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

  // Ellipsis content Array 一个具备省略操作的节点的组成成分，数组每一项表示待渲染的项目内容
  const renderEllipsis = (needEllipsis: boolean) => [
    // 第1项：省略符号(默认为字符串'...')
    needEllipsis && (
      <span aria-hidden key="ellipsis">
        {ELLIPSIS_STR}
      </span>
    ),
    // 第2项：省略后缀(如'xxxxxxx...-苏轼'中的'-苏轼'就是suffix，它跟在省略符号之后)
    ellipsisConfig.suffix,
    // 第3项：渲染其他操作节点，如展开按钮expandedIcon(默认是文本'Expand')，以及copyIcon
    renderOperations(needEllipsis),
  ];

  // 【渲染函数】调用上方renderXXX相关方法，作为 Ellipsis 组件的children传给它，其内部调用该方法以生成 Ellipsis 组件的渲染内容(后代)
  // 如果 needEllipsis 为false，则相当于返回传入的 node 节点(只不过重新声明了一个变量renderNode)
  const ellipsisChildren = (node: React.ReactNode, needEllipsis: boolean) => {
    // 待渲染的节点
    let renderNode: React.ReactNode = node;

    // 判断node是否具备长度length属性
    const noLengthAttr =
      node === null ||
      node === undefined ||
      typeof node === "boolean" ||
      typeof node === "symbol";

    // 具备length属性，并且需要省略，则用一个span包裹待渲染内容
    if (!noLengthAttr && needEllipsis) {
      renderNode = (
        <span key="show-content" aria-hidden>
          {renderNode}
        </span>
      );
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

  // >>>>> Base Component
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
