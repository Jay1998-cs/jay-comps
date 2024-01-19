import React, { forwardRef } from "react";
import classNames from "classnames";

export type IconWrapperProps = {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const IconWrapper = forwardRef<HTMLSpanElement, IconWrapperProps>(
  (props, ref) => {
    const { prefixCls, className, style, children } = props;

    const IconWrapperCls = classNames(`${prefixCls}-icon`, className);

    return (
      <span ref={ref} className={IconWrapperCls} style={style}>
        {children}
      </span>
    );
  }
);

export default IconWrapper;
