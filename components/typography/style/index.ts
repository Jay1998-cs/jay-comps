import { genComponentStyleHook } from "../../theme";
import { SeedToken } from "../../theme";
import {
  genDefaultTypographyStyle,
  genTextStyle,
  genLinkStyle,
  genIconStyle,
  genEllipsisStyle,
} from "./genStyleByToken";

export type TypographyToken = Partial<SeedToken> & {
  componentCls: string;

  colorTextDescription?: string;
  colorLinkHover?: string;
  colorLinkActive?: string;
};

function styleFn(token: TypographyToken) {
  const styleObjArray = [
    genDefaultTypographyStyle(token),
    genTextStyle(token),
    genLinkStyle(token),
    genIconStyle(token),
    genEllipsisStyle(token),
  ];

  return styleObjArray;
}

/**
 * @param prefixCls type string
 * @returns [wrapCSSVar, cssSelectorCls, cssVarCls]
 */
const useStyle = genComponentStyleHook("Typography", styleFn);

export default useStyle;
