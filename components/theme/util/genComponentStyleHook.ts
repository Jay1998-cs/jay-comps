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
    const [token, hashId] = useToken();

    const injectCSS = useStyleRegister(
      {
        token,
        path: [component, prefixCls],
        hashId,
      },
      () => {
        const componentCls = `.${prefixCls}`;
        return styleFn(Object.assign({ componentCls }, token));
      }
    );

    return [injectCSS, hashId];
  };
}
