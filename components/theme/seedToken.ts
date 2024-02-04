import { PresetColorType } from "./presetColors";

export const defaultPresetColors: PresetColorType = {
  blue: "#1677ff",
  purple: "#722ED1",
  cyan: "#13C2C2",
  green: "#52C41A",
  magenta: "#EB2F96",
  pink: "#eb2f96",
  red: "#F5222D",
  orange: "#FA8C16",
  yellow: "#FADB14",
  volcano: "#FA541C",
  geekblue: "#2F54EB",
  gold: "#FAAD14",
  lime: "#A0D911",
};

export interface SeedToken extends PresetColorType {
  // color
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBgContainer: string;
  // colorHover: string; // 所有按钮悬浮时的颜色

  colorPrimaryText: string; // primary button

  colorText: string;
  colorLink: string;

  // font
  color: string;
  fontSize: number;
  fontWeight: string;
  fontPrimaryWeight: number; // primary button

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
  zIndexPopupBase: number;
}

const defaultSeedToken: Partial<SeedToken> = {
  // preset color palettes
  ...defaultPresetColors,

  // Color
  color: "#000",
  colorText: "#000",
  colorPrimary: "#1677ff",
  colorSuccess: "#52c41a",
  colorWarning: "#faad14",
  colorError: "#ff4d4f",
  colorInfo: "#1677ff",
  colorLink: "#1677ff",
  colorBgContainer: "#fff",

  // font
  fontSize: 14,

  // padding
  padding: "4px 16px",

  // border
  border: "1px solid rgba(0,0,0,0.5)",

  // Radius
  borderRadius: 6,

  // Line
  lineWidth: 1,
  lineType: "solid",

  // Control Base
  controlHeight: 32,

  // zIndex
  zIndexBase: 0,
  zIndexPopupBase: 1000,

  // Image
  opacityImage: 1,
};

export default defaultSeedToken;
