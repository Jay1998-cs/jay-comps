import useToken from "../useToken";
import useStyleRegister from "./useStyleRegister";

// useStyle()
export default function genComponentStyleHook(
  component: string,
  styleFn: (token: any) => any
) {
  return (prefixCls: string) => {
    // 样式配置对象token形如{colorPrimary: '#1677ff'}
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
    ];
  };
}
