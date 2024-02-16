import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { CloseOutlined } from "@ant-design/icons";

import { LegacyButtonType } from "../button/buttonTypes";
import Button, { ButtonProps } from "../button/button";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";
import { hasContent } from "../_util/reactNode";
import { convertLegacyProps } from "../button/buttonHelpers";

// export type ModalFooterRender = (
//   originNode: React.ReactNode,
//   extra: { OkBtn: React.FC; CancelBtn: React.FC }
// ) => React.ReactNode;

export type ModalType =
  | "info"
  | "success"
  | "error"
  | "warn"
  | "warning"
  | "confirm";

export interface ModalProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  wrapClassName?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  open?: boolean;
  mask?: boolean;
  width?: string;
  type?: ModalType;
  centered?: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  zIndex?: number;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  // wrapProps?: any;
  // maskClosable?: boolean; // 单击mask(非modal区域)时关闭modal(需知鼠标位置)

  okType?: LegacyButtonType;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;

  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  afterClose?: () => void;
  afterOpenChange?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    wrapClassName,
    title,
    footer,
    closeIcon,
    zIndex,
    style,
    maskStyle,
    bodyStyle,
    children,
    centered = false,
    closable = true,
    open = false,
    mask = true,
    width = "520px",
    okText = "OK",
    okType = "primary",
    cancelText = "Cancel",
    okButtonProps,
    cancelButtonProps,
    onOk,
    onCancel,
    afterClose,
    afterOpenChange,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("modal", customizePrefixCls);

  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const [isMountFirst, setIsMountFirst] = useState(true);

  // >>>>> className
  const modalClassName = classNames(
    prefixCls,
    hashId,
    className,
    rootClassName,
    cssVarCls
  );

  const modalWrapperClassName = classNames(`${prefixCls}-wrap`, wrapClassName, {
    [`${prefixCls}-centered`]: !!centered,
    [`${prefixCls}-open`]: open,
  });

  // >>>>> effect
  useEffect(() => {
    setIsMountFirst(false);
  }, []);

  useEffect(() => {
    if (!isMountFirst && typeof afterOpenChange === "function") {
      afterOpenChange(open);
    }
    if (!isMountFirst && !open && typeof afterClose === "function") {
      afterClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // >>>>> event
  const handleClickOk = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>
  ) => {
    (onOk as React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>)?.(e);
  };

  const handleClickCancel = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>
  ) => {
    (onCancel as React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>)?.(
      e
    );
  };

  // >>>>> title
  const header = hasContent(title) ? (
    <div className={`${prefixCls}-header`}>
      <div className={`${prefixCls}-title`}>{title}</div>
    </div>
  ) : null;

  // >>>>> closeIcon
  const closeContent = closable ? (
    <span className={`${prefixCls}-close`} onClick={handleClickCancel}>
      {hasContent(closeIcon) ? closeIcon : <CloseOutlined />}
    </span>
  ) : null;

  // >>>>> footer
  const footerContent =
    footer === undefined ? (
      <>
        <Button onClick={handleClickCancel} {...cancelButtonProps}>
          {cancelText}
        </Button>
        <Button
          {...convertLegacyProps(okType)}
          onClick={handleClickOk}
          {...okButtonProps}
        >
          {okText}
        </Button>
      </>
    ) : (
      footer
    );

  // >>>>> render
  const modalWrapperStyle = { zIndex: zIndex };
  const modalStyle = { width: width, ...style };

  const modalNode = (
    <div className={`${prefixCls}-root ${hashId}`}>
      {open && mask && (
        <div className={`${prefixCls}-mask`} style={maskStyle} />
      )}
      <div
        className={modalWrapperClassName}
        style={modalWrapperStyle}
        tabIndex={-1}
      >
        <div className={modalClassName} style={modalStyle}>
          <div className={`${prefixCls}-content`}>
            {closeContent}
            {header}
            <div className={`${prefixCls}-body`} style={bodyStyle}>
              {children}
            </div>
            <div className={`${prefixCls}-footer`}>{footerContent}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(modalNode);
  }
  return modalNode;
};

export default Modal;
