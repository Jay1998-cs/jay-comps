import { ModalToken } from ".";
import { resetComponentStyle } from "../../style";

export const genModalBasicStyle = (token: ModalToken) => {
  const { componentCls: cls } = token;

  return {
    // root
    [`${cls}-root`]: {
      ...resetComponentStyle(token),
    },

    [`${cls}-root [class^="jay-modal"]`]: {
      boxSizing: "border-box",
    },

    // wrapper
    [`${cls}-root ${cls}-wrap`]: {
      position: "fixed",
      inset: "0",
      zIndex: token.zIndexPopupBase || 1000,
      overflow: "hidden",
      outline: "none",
      display: "none", // 默认隐藏
    },

    [`${cls}-root ${cls}-wrap${cls}-close`]: {
      display: "none",
    },

    [`${cls}-root ${cls}-wrap${cls}-open`]: {
      display: "block",
    },

    // modal
    [cls]: {
      ...resetComponentStyle(token),
      position: "relative",
      top: "120px",
      margin: "0 auto",
      width: "auto",
    },

    [`${cls}-root ${cls}-wrap${cls}-centered ${cls}`]: {
      top: "50%",
      transform: "translateY(-50%)",
    },

    // content
    [`${cls} ${cls}-content`]: {
      position: "relative",
      border: "0",
      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      pointerEvents: "auto",
      padding: token.contentPadding || "20px 24px",
      backgroundColor: token.contentBgColor || "#ffffff",
      backgroundClip: "padding-box",
    },

    // close
    [`${cls} ${cls}-close`]: {
      position: "absolute",
      top: "6px",
      insetInlineEnd: "16px",
      cursor: "pointer",
      zIndex: "1010",
      width: "32px",
      minWidth: "0",
      height: "32px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "rgba(0,0,0,0.5)",
      borderRadius: "4px",
      textDecoration: "none",
      border: "0",
      outline: "none",
    },

    [`${cls} ${cls}-close:active`]: {
      color: "rgba(0,0,0,1)",
    },

    // header
    [`${cls} ${cls}-header`]: {
      padding: "0 24px 0 0",
    },

    [`${cls} ${cls}-header ${cls}-title`]: {
      fontWeight: "600",
      fontSize: "16px",
      wordWrap: "break-word",
    },

    // body
    [`${cls} ${cls}-body`]: {
      marginTop: token.marginMD || "14px",
    },

    // footer
    [`${cls} ${cls}-footer`]: {
      padding: "0",
      marginTop: token.marginMD || "14px",
      borderRadius: "0",
      borderTop: "none",
      background: "transparent",
      textAlign: "end",
    },

    [`${cls} ${cls}-footer button`]: {
      marginInlineStart: token.marginSM || "10px",
    },
  };
};

export const genModalMaskStyle = (token: ModalToken) => {
  const { componentCls: cls } = token;

  return {
    [`${cls}-root ${cls}-mask`]: {
      position: "fixed",
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(0,0,0,0.45)",
      zIndex: token.zIndexPopupBase || 1000,
      inset: "0",
      pointerEvents: "none",
      border: "none",
      boxShadow: "none",
    },
  };
};

// const genModalMaskStyle = (token: ModalToken) => {
//   const { componentCls: cls } = token;
//   return { [cls]: {} };
// };
