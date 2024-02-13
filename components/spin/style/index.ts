import { TokenType } from "../../theme";
import { genComponentStyleHook } from "../../theme";
import { genSpinStyle } from "./genStyleByToken";

export type SpinToken = TokenType & {
  componentCls: string;

  contentHeight: number; // 内容高度
  dotSize: number; // 加载图标尺寸
  dotSizeSM: number; // 小号加载图标尺寸
  dotSizeLG: number; // 大号加载图标尺寸
  spinTipColor: string; // 加载中显式文字的颜色
};

const useStyle = genComponentStyleHook("spin", (token: SpinToken) => {
  const spinToken: SpinToken = Object.assign({}, token, {
    contentHeight: 400,
    dotSize: 20,
    dotSizeSM: 14,
    dotSizeLG: 32,
    spinTipColor: token.spinTipColor || token.colorPrimary || "#1677ff",
  });

  return [genSpinStyle(spinToken)];
});

export default useStyle;
