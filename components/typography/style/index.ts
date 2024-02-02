import { genComponentStyleHook } from "jay-comps/es/theme";
import { SeedToken } from "../../theme";

type TypographyToken = Partial<SeedToken>;

function styleFn(token: TypographyToken) {
  const styleObjArray = [{}];

  return styleObjArray;
}

/**
 * @param prefixCls type string
 * @returns [wrapCSSVar, cssSelectorCls, cssVarCls]
 */
const useStyle = genComponentStyleHook("Typography", styleFn);

export default useStyle;
