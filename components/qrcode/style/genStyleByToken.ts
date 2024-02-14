import { QRCodeToken } from ".";
import { resetComponentStyle } from "../../style";

export const genQRCodeStyle = (token: QRCodeToken) => {
  const { componentCls: cls } = token;

  return {
    [cls]: {
      ...resetComponentStyle(token),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: token.paddingMD || "12px",
      backgroundColor: "#ffffff",
      borderRadius: token.borderRadius || "8px",
      border: "1px solid rgba(5,5,5,0.06)",
      position: "relative",
      overflow: "hidden",
    },

    [`${cls} canvas`]: {
      alignSelf: "stretch",
      flex: "auto",
      minWidth: "0",
    },

    [`${cls} img`]: {
      verticalAlign: "middle",
      borderStyle: "none",
    },

    [`${cls}-borderless`]: {
      borderColor: "transparent",
    },

    [`${cls}-icon`]: {
      marginBlockEnd: token.marginSM || "8px",
      fontSize: token.controlHeight || "32px",
    },

    // mask
    [`${cls} ${cls}-mask`]: {
      position: "absolute",
      insetBlockStart: "0",
      insetInlineStart: "0",
      width: "100%",
      height: "100%",
      zIndex: "10",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: token.colorText || "#000",
      textAlign: "center",
      backgroundColor:
        token.QRCodeMaskBackgroundColor || "rgba(255, 255, 255, 0.96)",
    },

    [`${cls} ${cls}-mask ${cls}-expired-tip`]: {
      color: token.QRCodeExpiredTextColor || "rgba(0, 0, 0, 0.88)",
    },

    [`${cls} ${cls}-mask ${cls}-scanned-tip`]: {
      color: token.QRCodeScannedTextColor || "rgba(0, 0, 0, 0.88)",
    },
  };
};
