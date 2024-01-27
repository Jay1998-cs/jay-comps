import genComponentStyleHook from "../../theme/util/genComponentStyleHook";

function genButtonStyle(token: any) {
  // {componentCls: '.jay-btn', colorPrimary: '#1677ff', borderRadius: 6, _tokenKey: 'ujoqht'}
  const { componentCls } = token;

  return {
    [`${componentCls}`]: {
      border: "none",
      background: token.colorPrimary,
      color: "#fff",
      borderRadius: token.borderRadius,
    },
  };
}

// genComponentStyleHook() return function named useStyle()
const useStyle = genComponentStyleHook("Button", (token) => {
  return [genButtonStyle(token)];
});

export default useStyle;
