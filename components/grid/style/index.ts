import { SeedToken, genComponentStyleHook } from "../../theme";
import { genGridRowStyle } from "./genStyleByToken";

export type GridToken = Partial<SeedToken> & {
  componentCls: string;

  // 响应式屏幕取值范围 x区间为[xMin, xMax]
  screenXS?: number;
  screenXSMin?: number;
  screenXSMax?: number;

  screenSM?: number;
  screenSMMin?: number;
  screenSMMax?: number;

  screenMD?: number;
  screenMDMin?: number;
  screenMDMax?: number;

  screenLG?: number;
  screenLGMin?: number;
  screenLGMax?: number;

  screenXL?: number;
  screenXLMin?: number;
  screenXLMax?: number;

  screenXXL?: number;
  screenXXLMin?: number;
};

// >>>>> generate Row style
export const useRowStyle = genComponentStyleHook("grid", (token: GridToken) => [
  genGridRowStyle(token),
]);

// >>>>> generate Col style
export const useColStyle = genComponentStyleHook("grid", (token: GridToken) => [
  {},
]);
