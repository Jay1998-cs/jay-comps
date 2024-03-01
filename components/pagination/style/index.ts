import { TokenType, genComponentStyleHook } from "../../theme";
import { genPaginationStyle } from "./genStyleByToken";

export type PaginationToken = TokenType & {
  componentCls: string;

  buttonNumberWidth: string;
  colorButton: string;
  colorButtonHover: string;
  colorButtonActived: string;

  bgColorButton: string;
  bgColorButtonHover: string;
  bgColorButtonActived: string;
};

const useStyle = genComponentStyleHook(
  "pagination",
  (token: PaginationToken) => {
    return [genPaginationStyle(token)];
  }
);

export default useStyle;
