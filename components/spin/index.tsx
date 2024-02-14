import React, { useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import omit from "rc-util/lib/omit";
import { debounce } from "throttle-debounce";

import { isValidElement, cloneElement } from "../_util/reactNode";
import type { ConfigConsumerProps } from "../config-provider";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";

const SpinSizes = ["small", "default", "large"] as const;
export type SpinSize = (typeof SpinSizes)[number];
export type SpinIndicator = React.ReactElement<HTMLElement>;

export interface SpinProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  wrapperClassName?: string;
  size?: SpinSize;
  fullscreen?: boolean;
  spinning?: boolean;
  delay?: number;
  indicator?: SpinIndicator;
  tip?: React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type SpinType = React.FC<SpinProps> & {
  setDefaultIndicator: (indicator: React.ReactNode) => void;
};

// 判断是否需要延迟加载spin
function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

// >>>>> indicator
let defaultIndicator: React.ReactNode = null;

/**
 * @returns 返回加载中的样式组件(由三个dot组成)
 */
function renderIndicator(
  prefixCls: string,
  indicator: SpinProps["indicator"]
): React.ReactNode {
  const dotClassName = `${prefixCls}-dot`;

  if (indicator === null) {
    return null; //【注】undefined表示默认、会显示spin，显式地设置null才隐藏
  }

  if (isValidElement(indicator)) {
    return cloneElement(indicator, {
      className: classNames(indicator.props.className, dotClassName),
    });
  }

  if (isValidElement(defaultIndicator)) {
    return cloneElement(defaultIndicator, {
      className: classNames(defaultIndicator.props.className, dotClassName),
    });
  }

  return (
    <span className={classNames(dotClassName, `${prefixCls}-dot-spin`)}>
      <i key={1} className={`${prefixCls}-dot-item`} />
      <i key={2} className={`${prefixCls}-dot-item`} />
      <i key={3} className={`${prefixCls}-dot-item`} />
      <i key={4} className={`${prefixCls}-dot-item`} />
    </span>
  );
}

// =========================== Spin ===========================
const Spin: SpinType = (props) => {
  const {
    prefixCls: customPrefixCls,
    className,
    rootClassName,
    wrapperClassName,
    size = "default",
    fullscreen,
    spinning: customSpinning = true,
    delay = 0,
    tip,
    style,
    children,
    ...restProps
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("spin", customPrefixCls);

  const { spin, direction } = useContext<ConfigConsumerProps>(ConfigContext);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const [spinning, setSpinning] = useState<boolean>(
    () => customSpinning && !shouldDelay(customSpinning, delay)
  );

  const isNested = useMemo(() => {
    return typeof children !== "undefined" && !fullscreen;
  }, [children, fullscreen]);

  // >>>>> delay
  useEffect(() => {
    // 添加spin效果
    if (customSpinning) {
      const delaySpinFunc = debounce(delay, () => {
        setSpinning(true);
      });
      delaySpinFunc();

      return () => {
        if (typeof delaySpinFunc.cancel === "function") {
          delaySpinFunc.cancel();
        }
      };
    }

    // 取消spin(x 多余，因为执行到此，customSpinning为false则spinning也为false)
    setSpinning(false);
  }, [customSpinning, delay]);

  // >>>>> className
  const spinClassName = classNames(
    prefixCls,
    rootClassName,
    wrapperClassName,
    hashId,
    cssVarCls,
    spin?.className,
    {
      [`${prefixCls}-sm`]: size === "small",
      [`${prefixCls}-lg`]: size === "large",
      [`${prefixCls}-spinning`]: spinning,
      [`${prefixCls}-fullscreen`]: fullscreen,
      [`${prefixCls}-fullscreen-show`]: fullscreen && spinning,
      [`${prefixCls}-show-tip`]: !!tip,
      [`${prefixCls}-rtl`]: direction === "rtl",
    }
  );

  const childContainerClassName = classNames(`${prefixCls}-container`, {
    [`${prefixCls}-blur`]: spinning,
  });

  // >>>>> render
  const otherProps = omit(restProps, ["indicator"]);
  const mergedStyle: React.CSSProperties = { ...spin?.style, ...style };
  const hasCSSWrapper = typeof wrapCSSVar === "function";

  const spinElement: React.ReactNode = (
    <div
      {...otherProps}
      className={spinClassName}
      style={mergedStyle}
      aria-live="polite"
      aria-busy={spinning}
    >
      {renderIndicator(prefixCls, props["indicator"])}
      {tip && (isNested || fullscreen) ? (
        <div className={`${prefixCls}-text`}>{tip}</div>
      ) : null}
    </div>
  );

  if (isNested && hasCSSWrapper) {
    return wrapCSSVar(
      <div
        {...otherProps}
        className={classNames(
          `${prefixCls}-nested-loading`,
          wrapperClassName,
          hashId,
          cssVarCls
        )}
      >
        {spinning && <div key="loading">{spinElement}</div>}
        <div className={childContainerClassName} key="container">
          {children}
        </div>
      </div>
    );
  }

  if (hasCSSWrapper) {
    return wrapCSSVar(spinElement);
  }

  return spinElement;
};

Spin.setDefaultIndicator = (indicator: React.ReactNode) => {
  defaultIndicator = indicator;
};

export default Spin;
