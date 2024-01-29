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
    const [token, cssSelectorCls, tokenKey] = useToken(component);

    const info = {
      token,
      path: [tokenKey, component, prefixCls],
      cssSelectorCls,
    };

    const genStyleObjFn = () => {
      // { componentCls: '.jay-btn', colorPrimary: '#1677ff', ... }
      const componentCls = `.${prefixCls}`;
      return styleFn(Object.assign({ componentCls }, token)); // 闭包，引用token
    };

    const wrapCSSVar = useStyleRegister(info, genStyleObjFn);

    // 返回包裹node用于注入CSS的函数组件wrapCSSVar，以及node的样式类名cssSelectorCls
    return [wrapCSSVar, cssSelectorCls];
  };
}
