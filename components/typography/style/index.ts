import { genComponentStyleHook } from "../../theme";
import { SeedToken } from "../../theme";
import { genDefaultTypographyStyle, genTextStyle } from "./genStyleByToken";

export type TypographyToken = Partial<SeedToken> & {
  componentCls: string;
  colorTextDescription?: string;
};

function styleFn(token: TypographyToken) {
  const styleObjArray = [genDefaultTypographyStyle(token), genTextStyle(token)];

  return styleObjArray;
}

/**
 * @param prefixCls type string
 * @returns [wrapCSSVar, cssSelectorCls, cssVarCls]
 */
const useStyle = genComponentStyleHook("Typography", styleFn);

export default useStyle;
