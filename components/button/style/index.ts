import genComponentStyleHook from "../../theme/util/genComponentStyleHook";
import { TokenType } from "../../theme";
import {
  genTypeButtonStyle,
  genGhostButtonStyle,
  genDangerButtonStyle,
  genDisabledButtonStyle,
  genSizeButtonStyle,
  genShapeButtonStyle,
  genBlockButtonStyle,
} from "./genStyleByToken";

export type ButtonToken = Partial<
  TokenType & {
    componentCls: string;
  }
>;

/**
 *
 * @param token 组件的样式配置对象
 * @returns CSS样式对象数组，数组每一项相当于一个style对象，每一项会合并到一个style标签内
 * @returns 形如 [ { .jay-btn:{border:'none', ...}, .jay-btn-hover:{...} } , {...} ]
 */
function styleFn(token: ButtonToken) {
  const styleObjArray = [
    genSizeButtonStyle(token),
    genShapeButtonStyle(token),
    genBlockButtonStyle(token),
    genTypeButtonStyle(token),
    genGhostButtonStyle(token),
    genDangerButtonStyle(token),
    genDisabledButtonStyle(token),
  ];
  console.log("\n\n ##########", styleObjArray, "\n\n");

  return styleObjArray;
}

// genComponentStyleHook() return useStyle()
const useStyle = genComponentStyleHook("Button", styleFn);

export default useStyle;
