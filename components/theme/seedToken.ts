import { PresetColorType } from "./presetColors";

export interface SeedToken extends PresetColorType {
  // color
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorPrimaryText: string;
  colorText: string;
  colorInfo: string;
  colorLink: string;
  colorBgContainer: string;

  // font
  color: string;
  fontSize: number;

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
}
