import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import omit from "rc-util/lib/omit";
import useMergedState from "rc-util/lib/hooks/useMergedState";
import copy from "copy-to-clipboard";
import useIsomorphicLayoutEffect from "rc-util/lib/hooks/useLayoutEffect";
import { isStyleSupport } from "rc-util/lib/Dom/styleChecker";

import { TypographyProps } from "../Typography";
import type { TooltipProps } from "../../tooltip";
import { ConfigContext } from "jay-comps/es/config-provider";
import useMergedConfig from "../hooks/useMergedConfig";

export type BaseType = "secondary" | "success" | "warning" | "danger";

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
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: React.ReactNode;
  onExpand?: React.MouseEventHandler<HTMLElement>;
  onEllipsis?: (ellipsis: boolean) => void;
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
  const editIconRef = useRef<HTMLDivElement>(null);

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
    [
      mergedEnableEllipsis,
      ellipsisConfig.suffix,
      ellipsisConfig.onEllipsis,
      ellipsisConfig.expandable,
      enableCopy,
    ]
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

  const isMergedEllipsis =
    mergedEnableEllipsis && (cssEllipsis ? isNativeEllipsis : isJsEllipsis);

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
  const renderExpand = () => {};
  return null;
});

export default Base;
