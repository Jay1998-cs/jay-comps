import React, { useContext } from "react";
import classNames from "classnames";
import { ReloadOutlined } from "@ant-design/icons";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

import { ConfigContext } from "../config-provider";
import Spin from "../spin";

import type { CSSProperties } from "react";
import { useToken } from "../theme";

interface ImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
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
  status?: "active" | "expired" | "loading";
  onRefresh?: () => void;
}

const QRCode: React.FC<QRCodeProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    type = "canvas",
    size = 160,
    color = "#1677ff", // token.colorText
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

  const [wrapCSSVar, hashId, cssVarCls] = useStyle();
};

export default QRCode;
