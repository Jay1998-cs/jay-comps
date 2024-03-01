import { PaginationToken } from ".";
import { CSSConfigObj } from "../../theme";

export function genPaginationStyle(token: PaginationToken): CSSConfigObj {
  const { componentCls: cls } = token;

  return {
    [cls]: {
      width: "100%",
      fontSize: "1rem",
      fontWeight: "normal",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      whiteSpace: "nowrap",
      padding: "10px 0",
      color: "#000",
    },

    [`${cls} .btn`]: {
      display: "inline-block",
      height: "32px",
      lineHeight: "32px",
      backgroundColor: token.bgColorButton || "#373737",
      color: token.colorButton || "#fff",
      cursor: "pointer",
      borderRadius: token.borderRadius || "6px",
      textAlign: "center",
      userSelect: "none",
    },

    [`${cls} .btn.actived`]: {
      color: token.colorButtonActived || "#fff",
      backgroundColor:
        token.bgColorButtonActived || token.colorPrimary || "#1677ff",
    },

    [`${cls} .btn:hover`]: {
      color: token.colorButtonHover,
      backgroundColor: token.colorButtonHover,
      opacity: "0.92",
    },

    [`${cls} .btn:active`]: {
      opacity: "1",
    },

    [`${cls} .btn.number`]: {
      width: token.buttonNumberWidth || "32px",
    },

    [`${cls} .btn.text`]: {
      minWidth: "60px",
    },

    [`${cls} .btn.text.hidden`]: {
      display: "none",
    },
  };
}
