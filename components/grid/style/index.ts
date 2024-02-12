import { SeedToken, genComponentStyleHook } from "../../theme";
import {
  genGridRowStyle,
  genGridColSharedStyle,
  genGridColReactiveStyle,
  genDiffScreenMediaStyle,
} from "./genStyleByToken";

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

export interface GridRowToken extends GridToken {}

export interface GridColToken extends GridToken {
  gridColumns: number;
}

// >>>>> generate Row style
export const useRowStyle = genComponentStyleHook(
  "grid",
  (token: GridRowToken) => [genGridRowStyle(token)]
);

// >>>>> generate Col style
const screenXS = 480;
const screenSM = 576;
const screenMD = 768;
const screenLG = 992;
const screenXL = 1200;
const screenXXL = 1600;

export const screenSizeData = {
  screenXS,
  screenXSMin: screenXS,
  screenXSMax: screenSM - 1,
  screenSM,
  screenSMMin: screenSM,
  screenSMMax: screenMD - 1,
  screenMD,
  screenMDMin: screenMD,
  screenMDMax: screenLG - 1,
  screenLG,
  screenLGMin: screenLG,
  screenLGMax: screenXL - 1,
  screenXL,
  screenXLMin: screenXL,
  screenXLMax: screenXXL - 1,
  screenXXL,
  screenXXLMin: screenXXL,
} as const;

export type ScreenSize = keyof typeof screenSizeData;

export const setTokenScreenSize = (token: GridToken) => {
  if (screenSizeData && typeof screenSizeData === "object") {
    Object.keys(screenSizeData).forEach((size: ScreenSize) => {
      token[size] = token[size] ?? screenSizeData[size];
    });
  }

  return token;
};

export const useColStyle = genComponentStyleHook(
  "grid",
  (token: GridColToken) => {
    const mergedToken: GridColToken = Object.assign(
      {},
      setTokenScreenSize(token),
      {
        gridColumns: 24, // 栅格数(屏幕被划分为24等分)
      }
    );

    // 注意【顺序】，例如，媒体查询(media)放在最后【权重相同时后定义CSS优先】以响应屏幕尺寸
    return [
      genGridColSharedStyle(mergedToken),
      genGridColReactiveStyle(mergedToken, ""), // 默认、非响应式的24栅格布局
      genGridColReactiveStyle(mergedToken, "xs"), // xs为@media (max-width) 其他为min-width，需要单独创建
      genDiffScreenMediaStyle(mergedToken), // 响应式(@media)的24栅格布局
    ];
  }
);
