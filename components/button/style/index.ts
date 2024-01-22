import genComponentStyleHook from "../../theme/util/genComponentStyleHook";

function genButtonStyle(token: any) {
  const { componentCls } = token;

  return {
    [`${componentCls}`]: {
      border: "1px solid #000",
      background: "#fff",
      color: token.colorPrimary,
      borderRadius: token.borderRadius,
    },
  };
}

const useStyle = genComponentStyleHook("Button", (token) => {
  return [genButtonStyle(token)];
});

export default useStyle;
