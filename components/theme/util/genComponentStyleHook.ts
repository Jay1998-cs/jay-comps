import useToken from "../useToken";
import useStyleRegister from "./useStyleRegister";

export default function genComponentStyleHook(
  component: string,
  styleFn: (token: any) => any
) {
  return (prefixCls: string) => {
    const [token, hashId] = useToken();

    return [
      useStyleRegister(
        {
          token,
          path: [component, prefixCls],
          hashId,
        },
        () => {
          const componentCls = `.${prefixCls}`;
          return styleFn(Object.assign({ componentCls }, token));
        }
      ),
      hashId,
    ];
  };
}
