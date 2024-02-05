import { genComponentStyleHook } from "../../theme";
import { SeedToken } from "../../theme";
import {
  genDefaultTypographyStyle,
  genTitleStyle,
  genTextStyle,
  genLinkStyle,
  genIconStyle,
  genEllipsisStyle,
} from "./genStyleByToken";

export type TypographyToken = Partial<SeedToken> & {
  componentCls: string;

  // color
  colorTextDescription?: string; // 次级字体颜色(如浅灰色)
  colorTextHeading?: string; // h标签颜色
  colorLinkHover?: string;
  colorLinkActive?: string;

  // title margin(h标签的上下外边距)
  titleMarginTop?: string;
  titleMarginBottom?: string;
};

function styleFn(token: TypographyToken) {
  const styleObjArray = [
    genDefaultTypographyStyle(token),
    genTitleStyle(token),
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
