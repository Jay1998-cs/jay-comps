import { SeedToken, genComponentStyleHook } from "../../theme";
import {
  genFlexStyle,
  genGaptyle,
  genWraptyle,
  genAlignItemsStyle,
  genJustifyContentStyle,
} from "./genStyleByToken";

export type FlexToken = Partial<SeedToken> & {
  componentCls: string;

  // gap
  flexGapSM: number; // 小间隙
  flexGap: number; // 普通间隙
  flexGapLG: number; // 大间隙
};

const styleFn = (token: FlexToken) => {
  return [
    genFlexStyle(token),
    genGaptyle(token),
    genWraptyle(token),
    genAlignItemsStyle(token),
    genJustifyContentStyle(token),
  ];
};

const useStyle = genComponentStyleHook("flex", styleFn);

export default useStyle;
