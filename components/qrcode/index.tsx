import React, { useContext } from "react";
import type { CSSProperties } from "react";
import classNames from "classnames";
import { ReloadOutlined } from "@ant-design/icons";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

import { ConfigContext } from "../config-provider";
import useStyle from "./style";
import Button from "../button/index";
import Spin from "../spin/index";

interface ImageSettings {
  src: string;
  height: number;
  width: number;
  x?: number;
  y?: number;
  excavate: boolean;
}

export interface QRProps {
  value: string;
  type?: "canvas" | "svg";
  size?: number;
  color?: string;
  style?: CSSProperties;
  includeMargin?: boolean;
  imageSettings?: ImageSettings;
  bgColor?: string;
}

export type QRPropsCanvas = QRProps &
  React.CanvasHTMLAttributes<HTMLCanvasElement>;

export type QRPropsSvg = QRProps & React.SVGAttributes<SVGSVGElement>;

export interface QRCodeProps extends QRProps {
  className?: string;
  rootClassName?: string;
  prefixCls?: string;
  icon?: string;
  iconSize?: number;
  bordered?: boolean;
  errorLevel?: "L" | "M" | "Q" | "H";
  status?: "active" | "expired" | "loading" | "scanned";
  onRefresh?: () => void;
}

const QRCode: React.FC<QRCodeProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    value,
    type = "canvas",
    size = 160,
    color = "#000", // token.colorText
    bgColor = "transparent",
    icon = "",
    iconSize = 40,
    errorLevel = "M",
    status = "active",
    bordered = true,
    onRefresh,
    style,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("qrcode", customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // >>>>> setting
  const expiredTip = "QRCode Expired";
  const refreshTip = "Refresh";
  const scannedTip = "Scanned";

  const imageSettings: QRProps["imageSettings"] = {
    src: icon,
    x: undefined,
    y: undefined,
    height: iconSize,
    width: iconSize,
    excavate: true,
  };

  const qrCodeProps = {
    value,
    size,
    level: errorLevel,
    bgColor,
    fgColor: color,
    style: { width: undefined, height: undefined },
    imageSettings: icon ? imageSettings : undefined,
  };

  // >>>>> className
  const qrcodeClassName = classNames(
    prefixCls,
    className,
    rootClassName,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-borderless`]: !bordered,
    }
  );

  // >>>>> render
  const mergedStyle = {
    ...style,
    width: size,
    height: size,
    backgroundColor: bgColor,
  };

  const loadingContent = status === "loading" ? <Spin /> : null;

  const scannedContent =
    status === "scanned" ? (
      <p className={`${prefixCls}-scanned-tip`}>{scannedTip}</p>
    ) : null;

  const expiredContent =
    status === "expired" ? (
      <>
        <p className={`${prefixCls}-expired-tip`}>{expiredTip}</p>
        {onRefresh && (
          <Button type="link" onClick={onRefresh} icon={<ReloadOutlined />}>
            {refreshTip}
          </Button>
        )}
      </>
    ) : null;

  const qrcodeNode = (
    <div className={qrcodeClassName} style={mergedStyle}>
      {status !== "active" && (
        <div className={`${prefixCls}-mask`}>
          {loadingContent}
          {scannedContent}
          {expiredContent}
        </div>
      )}
      {type === "canvas" ? (
        <QRCodeCanvas {...qrCodeProps} />
      ) : (
        <QRCodeSVG {...qrCodeProps} />
      )}
    </div>
  );

  if (typeof wrapCSSVar === "function") {
    return wrapCSSVar(qrcodeNode);
  }
  return qrcodeNode;
};

export default QRCode;
