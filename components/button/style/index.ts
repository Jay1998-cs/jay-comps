import genComponentStyleHook from "../../theme/util/genComponentStyleHook";

function genButtonStyle(token: any) {
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

// useStyle Hook
const useStyle = genComponentStyleHook("Button", (token) => {
  return [genButtonStyle(token)];
});

export default useStyle;
