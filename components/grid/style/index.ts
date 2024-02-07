import { SeedToken } from "../../theme";

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
