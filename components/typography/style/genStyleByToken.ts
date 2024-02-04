import type { TypographyToken } from "./";

const genOperationUnitStyle = (selector: string, token: TypographyToken) => {
  if (!selector) return {};

  return {
    [selector]: {
      color: token.colorLink || "#1677ff",
      textDecoration: "none",
      outline: "none",
      cursor: "pointer",
    },

    [`${selector}:hover`]: {
      color: token.colorLinkHover || "#1677ff",
    },

    [`${selector}:active`]: {
      color: token.colorLinkActive || "#1677ff",
    },
  };
};

const genDefaultTypographyStyle = (token: TypographyToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      color: token.colorText || "#000",
      wordBreak: "break-word",
      fontSize: token.fontSize || "14px",
    },
  };
};

const genTextStyle = (token: TypographyToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-secondary`]: {
      color: token.colorTextDescription || "rgba(0,0,0,0.55)",
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

    [`${componentCls} code`]: {
      margin: "0 0.2em",
      paddingInline: "0.4em",
      paddingBlock: "0.2em 0.1em",
      fontSize: "85%",
      background: "rgba(150, 150, 150, 0.1)",
      border: "1px solid rgba(100, 100, 100, 0.2)",
      borderRadius: 3,
    },

    [`${componentCls} kbd`]: {
      margin: "0 0.2em",
      paddingInline: "0.4em",
      paddingBlock: "0.15em 0.1em",
      fontSize: "90%",
      background: "rgba(150, 150, 150, 0.06)",
      border: "1px solid rgba(100, 100, 100, 0.2)",
      borderBottomWidth: 2,
      borderRadius: 3,
    },
  };
};

const genLinkStyle = (token: TypographyToken) => {
  const { componentCls } = token;
  const selector = `${componentCls}:where(a)`;

  return genOperationUnitStyle(selector, token);
};

const genIconStyle = (token: TypographyToken) => {
  const { componentCls } = token;

  return {
    ...genOperationUnitStyle(`${componentCls} ${componentCls}-copy`, token),
    ...genOperationUnitStyle(`${componentCls} ${componentCls}-edit`, token),
    ...genOperationUnitStyle(`${componentCls} ${componentCls}-expand`, token),
  };
};

const genEllipsisStyle = (token: TypographyToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-ellipsis`]: { display: "inline-block", maxWidth: "100%" },

    [`${componentCls}-single-line`]: { whiteSpace: "nowrap" },

    [`${componentCls}-ellipsis-single-line`]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    [`${componentCls}-ellipsis-single-line code`]: {
      paddingBlock: 0,
      maxWidth: "calc(100% - 1.2em)",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      verticalAlign: "bottom",
      // https://github.com/ant-design/ant-design/issues/45953
      boxSizing: "content-box",
    },

    [`${componentCls}-ellipsis-multiple-line`]: {
      display: "-webkit-box",
      overflow: "hidden",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
    },
  };
};

export {
  genDefaultTypographyStyle,
  genTextStyle,
  genLinkStyle,
  genIconStyle,
  genEllipsisStyle,
};
