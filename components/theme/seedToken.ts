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

  colorPrimaryText: string; // primary button

  colorText: string;
  colorLink: string;

  // font
  color: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
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
  paddingXS: string;
  paddingSM: string;
  paddingMD: string;
  paddingLG: string;

  // margin
  marginXS: string;
  marginSM: string;
  marginMD: string;
  marginLG: string;

  // height
  controlHeight: number;
  controlHeightSM: number;
  controlHeightLG: number;

  // hover
  hoverBorderColor: string;
  hoverBg: string;

  // disabled
  colorBgContainerDisabled: string;
  colorTextDisabled: string;

  // other
  zIndexBase: string;
  opacityImage: string;
  zIndexPopupBase: string;

  boxSizing: string;
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
  paddingXS: "6px",
  paddingSM: "10px",
  paddingMD: "14px",
  paddingLG: "18px",

  // margin
  marginXS: "6px",
  marginSM: "10px",
  marginMD: "14px",
  marginLG: "18px",

  // border
  border: "1px solid rgba(0,0,0,0.5)",
  colorBorder: "#d9d9d9",

  // Radius
  borderRadius: 6,

  // Line
  lineWidth: 1,
  lineType: "solid",

  // Control Base
  controlHeight: 32,
  controlHeightSM: 24,
  controlHeightLG: 40,

  // zIndex
  zIndexBase: "0",
  zIndexPopupBase: "1000",

  // Image
  opacityImage: "1",

  // display
  boxSizing: "border-box",

  // hover
  hoverBorderColor: "#1677ff",
  hoverBg: "#fff",

  // disabled
  colorBgContainerDisabled: "rgba(0,0,0,0.04)",
  colorTextDisabled: "rgba(0,0,0,0.25)",
};

export default defaultSeedToken;
