import type { TypographyToken } from "./";

const genDefaultTypographyStyle = (token: TypographyToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      color: token.colorText || "#000",
      wordBreak: "break-word",
    },
  };
};

const genTextStyle = (token: TypographyToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-secondary`]: {
      color: token.colorTextDescription || "rgba(0,0,0,0.45)",
    },

    [`${componentCls}-success`]: {
      color: token.colorSuccess,
    },

    [`${componentCls}-warning`]: {
      color: token.colorWarning,
    },

    [`${componentCls}-danger`]: {
      color: token.colorError,
    },

    [`${componentCls}-disabled`]: {
      color: "rgba(0,0,0,0.25)",
      cursor: "not-allowed",
      userSelect: "none",
    },
  };
};

export { genDefaultTypographyStyle, genTextStyle };
