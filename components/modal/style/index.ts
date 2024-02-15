import { TokenType, genComponentStyleHook } from "../../theme";
import { genModalBasicStyle, genModalMaskStyle } from "./genStyleByToken";

export type ModalToken = TokenType & {
  componentCls: string;

  contentPadding: string;
  contentBgColor: string;
};

const useStyle = genComponentStyleHook("modal", (token: ModalToken) => {
  const mergedToken = Object.assign(token, {
    contentPadding: "20px 24px",
    contentBgColor: "#ffffff",
  });

  return [genModalBasicStyle(mergedToken), genModalMaskStyle(mergedToken)];
});

export default useStyle;
