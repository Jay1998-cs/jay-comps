import type { ButtonToken } from "./";

/////////////////////////// type //////////////////////////////////
const genDefaultButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  token.colorPrimary = token.colorPrimary ?? "#167ff";

  const defaultStyle: any = {};
  if (token.colorBorder !== undefined) {
    defaultStyle["borderColor"] = token.colorBorder as string;
  }

  return {
    // all
    [`${componentCls}`]: {
      border: token.border || "none",
      background: token.colorBgContainer || "#fff",
      color: token.color || "#000",
      borderRadius: token.borderRadius || "6px",
      padding: token.padding || "4px 16px",
      display: "inline-block",
      fontSize: "14px",
      fontWeight: token.fontWeight || "normal",
      cursor: "pointer",
      minHeight: "32px",
    },

    [`${componentCls}:hover`]: {
      color: token.colorPrimary,
      borderColor: token.colorPrimary,
      opacity: "0.75",
    },

    [`${componentCls}:active`]: {
      opacity: "1",
    },

    // default
    [`${componentCls}${componentCls}-default`]: defaultStyle,
  };
};

const genPrimaryButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-primary`]: {
      background: token.colorPrimary,
      color: token.colorPrimaryText || "#fff",
      border: "none",
      fontWeight: token.fontPrimaryWeight || "normal",
    },

    [`${componentCls}-primary:hover`]: {
      color: token.colorPrimaryText || "#fff",
    },
  };
};

const genDashedButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  const styleObj: any = {};
  if (token.colorBorder !== undefined) {
    styleObj["borderColor"] = token.colorBorder as string;
  }

  return {
    [`${componentCls}-dashed`]: {
      border: "1px dashed #000",
      ...styleObj,
    },
  };
};

const genTextButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-text`]: {
      color: token.colorText || "#000",
      border: "none",
      background: "transparent",
    },
    [`${componentCls}-text:hover`]: {
      background: "rgba(0,0,0,0.06)",
    },
  };
};

const genLinkButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-link`]: {
      border: "none",
      color: token.colorLink || token.colorPrimary || "#1677ff",
      background: "transparent",
    },
    [`${componentCls}-link:hover`]: {
      color: token.colorLink || token.colorPrimary || "#1677ff",
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
      color: token.colorBgContainer || "#fff",
      background: "transparent ",
      borderColor: token.colorBgContainer || "#fff",
    },
    // [`${componentCls}-ghost:hover`]: {
    //   color: token.colorBgContainer || "#fff",
    // },
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
    [`${componentCls}${componentCls}-danger`]: {
      color: dangerColor,
      borderColor: dangerColor,
    },
    [`${componentCls}${componentCls}-danger:hover`]: {
      color: dangerColor,
      borderColor: dangerColor,
      opacity: "0.7",
    },
    [`${componentCls}${componentCls}-danger:active`]: {
      color: dangerColor,
      borderColor: dangerColor,
      opacity: "1",
    },
    // primary danger
    [`${componentCls}${componentCls}-danger${componentCls}-primary`]: {
      color: "#fff",
      background: dangerColor,
    },
    // text danger
    [`${componentCls}${componentCls}-danger${componentCls}-text:hover`]: {
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
    [`${componentCls}${componentCls}-disabled`]: disabledStyle,
    [`${componentCls}${componentCls}-disabled:hover, ${componentCls}${componentCls}-disabled:active`]:
      disabledStyle,
    // text disabled
    [`${componentCls}${componentCls}-disabled${componentCls}-text`]: {
      background: "none",
    },
    [`${componentCls}${componentCls}-disabled${componentCls}-text:hover`]: {
      background: "none",
    },
    // link disabled
    [`${componentCls}${componentCls}-disabled${componentCls}-link`]: {
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
    [`${componentCls}${componentCls}-lg`]: lgStyle,

    // small size
    [`${componentCls}${componentCls}-sm`]: smStyle,
  };
};

/////////////////////////// shape //////////////////////////////////

const genShapeButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  return {
    // circle shape
    [`${componentCls}-circle${componentCls}`]: {
      minWidth: "32px",
      minHeight: "32px",
      borderRadius: "50%",
      padding: "6px",
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

/////////////////////////// icon //////////////////////////////////

const genIconOnlyButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;
  return {
    // icon only
    [`${componentCls}-icon-only`]: {
      width: "32px",
      paddingInlineStart: "0",
      paddingInlineEnd: "0",
    },
  };
};

/////////////////////////// loading //////////////////////////////////

const genLodingButtonStyle = (token: ButtonToken) => {
  const { componentCls } = token;

  return {
    // icon only
    [`${componentCls}${componentCls}-loading`]: {
      opacity: "0.7",
      cursor: "default",
      pointerEvents: "none",
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
  genIconOnlyButtonStyle,
  genLodingButtonStyle,
};
