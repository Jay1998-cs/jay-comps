import { genComponentStyleHook } from "../../theme";
import type { TokenType } from "../../theme";
import {
  genBasicInputStyle,
  genPrefixAndSuffixInputStyle,
} from "./genStyleByToken";

export type InputToken = TokenType & {
  componentCls: string;
};

const useStyle = genComponentStyleHook("Input", (token: InputToken) => {
  return [genBasicInputStyle(token), genPrefixAndSuffixInputStyle(token)];
});

export default useStyle;
