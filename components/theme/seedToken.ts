import { PresetColorType } from "./presetColors";

export interface SeedToken extends PresetColorType {
  // color
  colorPrimary: string;

  colorSuccess: string;

  colorWarning: string;

  colorError: string;

  colorInfo: string;

  colorTextBase: string;

  colorBgBase: string;

  colorLink: string;

  // font
  fontSize: number;

  // line
  lineWidth: number;
  lineType: string;

  // border
  // border: string;
  borderRadius: number;

  // other
  controlHeight: number;

  zIndexBase: number;

  opacityImage: number;
}
