import useToken from "../useToken";
import useStyleRegister from "./useStyleRegister";

/**
 * @param component refer to component name like Button
 * @param styleFn function to generate style object
 */
export default function genComponentStyleHook(
  component: string,
  styleFn: (token: any) => any
) {
  // real useStyle()
  return (prefixCls: string) => {
    const [token, hashId, tokenKey] = useToken(component);

    const info = {
      token,
      tokenKey,
      path: [component, prefixCls],
      hashId,
    };

    const genStyleObjFn = () => {
      // { componentCls: '.jay-btn', colorPrimary: '#1677ff', ... }
      const componentCls = `.${prefixCls}`;
      return styleFn(Object.assign({ componentCls }, token)); // 闭包，引用token
    };

    const wrapCSSVar = useStyleRegister(info, genStyleObjFn);

    return [wrapCSSVar, hashId];
  };
}
