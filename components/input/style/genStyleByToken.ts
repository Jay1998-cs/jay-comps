import { InputToken } from "./";
import { resetComponentStyle } from "../../style";

export const genBasicInputStyle = (token: InputToken) => {
  const { componentCls: cls } = token;

  return {
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
    },

    [`${cls}:hover`]: {
      borderColor: token.hoverBorderColor || "#1677ff",
      backgroundColor: token.hoverBg || "#fff",
    },

    [`${cls}-rtl`]: {
      direction: "rtl",
    },

    // borderless
    [`${cls}-borderless`]: {
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

    // size
    [`${cls}-sm`]: {
      height: token.controlHeightSM || 24,
    },
    [`${cls}-lg`]: {
      height: token.controlHeightLG || 40,
    },
  };
};

// export const genBasicInputStyle = (token: InputToken) => {
//   const { componentCls: cls } = token;

//   return {
//     [cls]: {},
//   };
// };
