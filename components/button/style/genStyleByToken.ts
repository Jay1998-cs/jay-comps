import type { ButtonToken } from "./";

/////////////////////////// type //////////////////////////////////
const genDefaultButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}`]: {
      border: token.border || "none",
      background: token.colorBgBase || "#fff",
      color: token.color || token.colorInfo || "#000",
      borderRadius: token.borderRadius || "6px",
      padding: token.padding || "4px 16px",
      display: "inline-block",
      fontSize: "14px",
      cursor: "pointer",
    },

    [`${componentCls}:hover`]: {
      color: token.colorPrimary,
      borderColor: token.colorPrimary,
      opacity: "0.7",
    },

    [`${componentCls}:active`]: {
      opacity: "1",
    },
  };
};

const genPrimaryButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-primary`]: {
      background: token.colorPrimary,
      color: "#fff",
      border: "none",
    },

    [`${componentCls}-primary:hover`]: {
      color: "#fff",
    },
  };
};

const genDashedButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-dashed`]: {
      border: "1px dashed #000",
    },
  };
};

const genTextButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-link`]: {
      border: "none",
      color: token.colorPrimary,
      background: "transparent",
    },
  };
};

const genLinkButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-text`]: {
      border: "none",
      background: "transparent",
    },
    [`${componentCls}-text:hover`]: {
      background: "rgba(0,0,0,0.06)",
    },
  };
};

/**
 *
 * @param token ButtonToken
 * @returns type style object 返回对象的key是选择器名，value是样式对象
 */
const genTypeButtonStyle = (token: ButtonToken) => {
  return {
    ...genDefaultButtonStyle(token),
    ...genPrimaryButtonStyle(token),
    ...genDashedButtonStyle(token),
    ...genTextButtonStyle(token),
    ...genLinkButtonStyle(token),
  };
};

/////////////////////////// ghost //////////////////////////////////

const genGhostButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    // default ghost
    [`${componentCls}-ghost`]: {
      color: "#fff",
      background: "transparent ",
      borderColor: "#fff",
    },
    // primary ghost
    [`${componentCls}-ghost${componentCls}-primary`]: {
      color: token.colorPrimary || token.color || "#1677ff",
      border: `1px solid ${token.colorPrimary || token.color || "#1677ff"}`,
    },
  };
};

/////////////////////////// danger //////////////////////////////////

const genDangerButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  const dangerColor = "rgb(255,75,75)";

  return {
    // default danger
    [`${componentCls}-danger`]: {
      color: dangerColor,
      borderColor: dangerColor,
    },
    [`${componentCls}-danger:hover`]: {
      color: dangerColor,
      borderColor: dangerColor,
      opacity: "0.7",
    },
    [`${componentCls}-danger:active`]: {
      color: dangerColor,
      borderColor: dangerColor,
      opacity: "1",
    },
    // primary danger
    [`${componentCls}-danger${componentCls}-primary`]: {
      color: "#fff",
      background: dangerColor,
    },
    // text danger
    [`${componentCls}-danger${componentCls}-text:hover`]: {
      background: "rgb(255,240,240)",
    },
  };
};

/////////////////////////// disabled //////////////////////////////////

const genDisabledButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  const disabledStyle = {
    cursor: "not-allowed",
    PointerEvent: "none",
    color: "rgba(0,0,0,0.25)",
    background: "rgba(0,0,0,0.04) ",
    borderColor: "#d9d9d9",
    opacity: "1",
  };

  return {
    // default disabled
    [`${componentCls}-disabled`]: disabledStyle,
    [`${componentCls}-disabled:hover, ${componentCls}-disabled:active`]:
      disabledStyle,
    // text disabled
    [`${componentCls}-disabled${componentCls}-text`]: {
      background: "none",
    },
    // link disabled
    [`${componentCls}-disabled${componentCls}-link`]: {
      background: "none",
    },
  };
};

/////////////////////////// size //////////////////////////////////

const genSizeButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  const lgStyle = {
    fontSize: "16px",
    height: "40px",
    padding: "7px 16px",
    borderRadius: "8px",
  };

  const smStyle = {
    fontSize: "12px",
    height: "24px",
    padding: "0px 7px",
    borderRadius: "4px",
  };

  return {
    // large size
    [`${componentCls}-lg${componentCls}`]: lgStyle,

    // small size
    [`${componentCls}-sm${componentCls}`]: smStyle,
  };
};

/////////////////////////// shape //////////////////////////////////

const genShapeButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  return {
    // circle shape
    [`${componentCls}-circle${componentCls}`]: {
      minWidth: "32px",
      borderRadius: "50%",
    },
    // round shape
    [`${componentCls}-round${componentCls}`]: {
      borderRadius: "32px",
    },
  };
};

/////////////////////////// block //////////////////////////////////

const genBlockButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  return {
    // large size
    [`${componentCls}-block`]: {
      width: "100%",
    },
  };
};

export {
  genTypeButtonStyle,
  genGhostButtonStyle,
  genDangerButtonStyle,
  genDisabledButtonStyle,
  genSizeButtonStyle,
  genShapeButtonStyle,
  genBlockButtonStyle,
};
