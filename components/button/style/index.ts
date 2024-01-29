import genComponentStyleHook from "../../theme/util/genComponentStyleHook";

/**
 *
 * @param token 组件的样式配置对象
 * @returns 组件的CSS样式对象，key为选择器，value为若干条声明组成的对象
 */
function genButtonStyle(token: any) {
  // {componentCls: '.jay-btn', colorPrimary: '#1677ff', borderRadius: 6, ... }
  const { componentCls } = token;

  // Button的CSS样式
  return {
    [`${componentCls}`]: {
      border: token.border || "none",
      background: token.colorPrimary || "#1677ff",
      color: token.color || "#fff",
      borderRadius: token.borderRadius || "6px",
      padding: token.padding || "4px 16px",
      cursor: "pointer",
    },

    [`${componentCls}:hover`]: {
      opacity: "0.9",
    },

    [`${componentCls}:active`]: {
      opacity: "1",
    },
  };
}

/**
 *
 * @param token 组件的样式配置对象
 * @returns CSS样式对象数组，每一个项表示一条CSS规则对象(key是选择器，value是声明)
 */
function styleFn(token: any) {
  // [ {.jay-btn: {border:'none', background:'#1677ff', color:'#fff', ...}} ]
  // console.error([genButtonStyle(token)]);
  return [genButtonStyle(token)];
}

// genComponentStyleHook() return useStyle()
const useStyle = genComponentStyleHook("Button", styleFn);

export default useStyle;
