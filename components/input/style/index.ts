import { genComponentStyleHook } from "../../theme";
import type { TokenType } from "../../theme";
import { genBasicInputStyle } from "./genStyleByToken";

export type InputToken = TokenType & {
  componentCls: string;
};

const useStyle = genComponentStyleHook("Input", (token: InputToken) => {
  return [genBasicInputStyle(token)];
});

export default useStyle;
