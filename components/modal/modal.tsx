import React, { useContext } from "react";
import classNames from "classnames";
import { CloseOutlined } from "@ant-design/icons";

import { LegacyButtonType } from "../button/buttonTypes";
import Button, { ButtonProps } from "../button/button";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";

export type ModalFooterRender = (
  originNode: React.ReactNode,
  extra: { OkBtn: React.FC; CancelBtn: React.FC }
) => React.ReactNode;

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
  closeIcon?: boolean | React.ReactNode;
  maskClosable?: boolean;
  zIndex?: number;
  title?: React.ReactNode;
  footer?: ModalFooterRender | React.ReactNode;
  wrapProps?: any;
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;

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
    open,
    centered,
    closable,
    closeIcon,
    width = "520px",
    footer,
    style,
    children,
    ...restProps
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("modal", customizePrefixCls);

  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

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
  });

  // >>>>> title

  // >>>>> footer
  const modalFooter = (
    <>
      <Button>Cancel</Button>
      <Button type="primary">OK</Button>
    </>
  );

  // >>>>> render
  const modalStyle = { width: width };

  const modalNode = (
    <div className={`${prefixCls}-root ${hashId}`}>
      <div className={`${prefixCls}-mask`} />
      <div className={modalWrapperClassName}>
        <div className={modalClassName} style={modalStyle}>
          <div className={`${prefixCls}-content`}>
            <span className={`${prefixCls}-close`}>{<CloseOutlined />}</span>
            <div className={`${prefixCls}-header`}>header</div>
            <div className={`${prefixCls}-body`}>body</div>
            <div className={`${prefixCls}-footer`}>{modalFooter}</div>
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
