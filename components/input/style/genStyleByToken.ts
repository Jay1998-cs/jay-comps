import { InputToken } from "./";
import { resetComponentStyle } from "../../style";

export const genBasicInputStyle = (token: InputToken) => {
  const { componentCls: cls } = token;

  return {
    // basic
    [cls]: {
      ...resetComponentStyle(token),
      display: "inline-block",
      width: "100%",
      outline: "none",
      height: token.controlHeight || 32,
      minWidth: "0",
      border: "1px solid rgb(133,133,133)",
      borderRadius: token.borderRadius || 6,
      padding: "4px 12px",
      backgroundColor: token.colorBgContainer,
      backgroundImage: "none",
      transition: "all 0.2s",
      color: token.colorText || "#000",
    },

    [`${cls}-outline:hover`]: {
      borderColor: token.hoverBorderColor || "#1677ff",
      backgroundColor: token.hoverBg || "#fff",
    },

    [`${cls}-outline:focus`]: {
      boxShadow: "0 0 0 2px rgba(5,145,255,0.1)",
    },

    [`${cls}:placeholder-shown`]: {
      textOverflow: "ellipsis",
    },

    [`${cls}-rtl`]: {
      direction: "rtl",
    },

    // size
    [`${cls}-sm`]: {
      height: token.controlHeightSM || 24,
    },
    [`${cls}-lg`]: {
      height: token.controlHeightLG || 40,
    },

    // status
    [`${cls}-outline${cls}-status-error`]: {
      borderColor: token.colorError || "#ff4d4f",
    },
    [`${cls}-outline${cls}-status-error:hover`]: {
      borderColor: token.colorHoverError || "#ffa39e",
    },
    [`${cls}-outline${cls}-status-error:focus`]: {
      boxShadow: "0 0 0 2px rgba(255,38,5,0.08)",
    },
    [`${cls}-outline${cls}-status-warning`]: {
      borderColor: token.colorWarning || "#faad14",
    },
    [`${cls}-outline${cls}-status-warning:hover`]: {
      borderColor: token.colorHoverWarning || "#ffd666",
    },
    [`${cls}-outline${cls}-status-warning:focus`]: {
      boxShadow: "0 0 0 2px rgba(255,215,5,0.1)",
    },

    // borderless
    [`${cls}${cls}-borderless`]: {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    },

    // disabled
    [`${cls}${cls}-disabled`]: {
      cursor: "not-allowed",
      boxShadow: "none",
      opacity: "1",
      color: token.colorTextDisabled,
      backgroundColor: token.colorBgContainerDisabled,
      borderColor: token.colorBorder,
    },

    [`${cls}${cls}-borderless${cls}-disabled`]: {
      backgroundColor: "transparent",
    },
  };
};

export const genPrefixAndSuffixInputStyle = (token: InputToken) => {
  const { componentCls: cls } = token;
  const wrapperCls = `${cls}-affix-wrapper`;
  const prefixCls = `${wrapperCls} ${cls}-prefix`;
  const suffixCls = `${wrapperCls} ${cls}-suffix`;

  return {
    [wrapperCls]: {
      ...resetComponentStyle(token),
      border: "1px solid rgb(133,133,133)",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      minWidth: "0",
      padding: "4px 11px",
      fontSize: token.fontSize || 14,
      borderRadius: token.borderRadius || 6,
      color: token.colorText || "#000",
    },

    [`${wrapperCls}-fillWrapper`]: {
      padding: "0",
      margin: "0",
    },

    // input
    [`${wrapperCls} ${cls}-outline${cls}`]: {
      border: "none",
      boxShadow: "none",
    },

    // prefix & suffix
    [`${wrapperCls} ${cls}-prefix, ${cls}-suffix`]: {
      display: "flex",
      flex: "none",
      alignItems: "center",
    },

    [prefixCls]: {
      marginInlineEnd: "4px",
    },

    [suffixCls]: {
      marginInlineStart: "4px",
    },

    // status
    [`${wrapperCls}${wrapperCls}-status-error ${cls}-prefix`]: {
      color: token.colorError || "#ff4d4f",
    },
    [`${wrapperCls}${wrapperCls}-status-error ${cls}-suffix`]: {
      color: token.colorError || "#ff4d4f",
    },

    [`${wrapperCls}${wrapperCls}-status-warning ${cls}-prefix`]: {
      color: token.colorWarning || "#faad14",
    },
    [`${wrapperCls}${wrapperCls}-status-warning ${cls}-suffix`]: {
      color: token.colorWarning || "#faad14",
    },

    // borderless
    [`${wrapperCls}-borderless`]: {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    },

    // disabled
    [`${wrapperCls}-disabled`]: {
      cursor: "not-allowed",
      boxShadow: "none",
      opacity: "1",
      color: token.colorTextDisabled,
      backgroundColor: token.colorBgContainerDisabled,
      borderColor: token.colorBorder,
    },

    [`${wrapperCls}-disabled ${cls}`]: {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    },

    [`${wrapperCls}${wrapperCls}-borderless${wrapperCls}-disabled`]: {
      backgroundColor: "transparent",
    },
  };
};
