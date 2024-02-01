import { PresetColorType } from "./presetColors";

export interface SeedToken extends PresetColorType {
  // color
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBgContainer: string;
  // colorHover: string; // 所有按钮悬浮时的颜色

  // font
  color: string;
  fontSize: number;
  fontWeight: string;

  // line
  lineWidth: number;
  lineType: string;

  // border
  border: string;
  colorBorder: string;
  borderRadius: number;

  // padding
  padding: string;

  // other
  controlHeight: number;
  zIndexBase: number;
  opacityImage: number;

  // button
  fontPrimaryWeight: number;
  colorPrimaryText: string; // primary button
  colorText: string; // text button
  colorLink: string; // link button
}
