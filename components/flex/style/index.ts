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
  flexGapSM: string; // 小间隙
  flexGap: string; // 普通间隙
  flexGapLG: string; // 大间隙
};

const styleFn = (token: FlexToken) => {
  return [
    genFlexStyle(token),
    genWraptyle(token),
    genAlignItemsStyle(token),
    genJustifyContentStyle(token),
    genGaptyle(token),
  ];
};

const useStyle = genComponentStyleHook("flex", styleFn);

export default useStyle;
