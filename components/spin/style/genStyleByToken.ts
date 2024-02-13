import { SpinToken } from ".";
import { resetComponentStyle } from "../../style";

export const genSpinStyle = (token: SpinToken) => {
  const { componentCls: cls } = token;

  token.colorPrimary ??= "#167ff";
  token.dotSize ??= 20;
  token.dotSizeSM ??= 14;
  token.dotSizeLG ??= 32;
  token.spinTipColor ??= token.colorPrimary;

  return {
    // spin
    [`${cls}`]: {
      ...resetComponentStyle(token),
      position: "absolute",
      display: "none", // 隐藏1
      opacity: "0", // 隐藏2
      fontSize: "0",
      textAlign: "center",
      verticalAlign: "middle",
      color: token.colorPrimary,
      transition: "transform 0.5s",
      padding: 5,
    },

    [`${cls}-spinning`]: {
      position: "static",
      display: "inline-block", // 显示1
      opacity: "1", // 显示2
    },

    // dot
    [`${cls} ${cls}-dot`]: {
      position: "relative",
      display: "inline-block",
      fontSize: token.dotSize,
      width: token.dotSize,
      height: token.dotSize,
    },

    [`${cls} ${cls}-dot-spin`]: {
      animationName: "spinRotate", // wrapper animation
      animationDuration: "1.2s",
      animationIterationCount: "infinite",
      animationTimingFunction: "linear",
    },

    // dot-item
    [`${cls} ${cls}-dot ${cls}-dot-item`]: {
      position: "absolute",
      display: "block",
      width: Math.floor(token.dotSize / 2.5),
      height: Math.floor(token.dotSize / 2.5),
      backgroundColor: token.colorPrimary,
      borderRadius: "100%",
      transformOrigin: "50% 50%",
      opacity: "0.3",
      animationName: "spinMove", // dot animation
      animationDuration: "1s",
      animationIterationCount: "infinite",
      animationTimingFunction: "linear",
      animationDirection: "alternate",
    },
    [`${cls} ${cls}-dot ${cls}-dot-item:nth-child(1)`]: {
      top: 0,
      insetInlineStart: 0,
      animationDelay: "0s",
    },
    [`${cls} ${cls}-dot ${cls}-dot-item:nth-child(2)`]: {
      top: 0,
      insetInlineEnd: 0,
      animationDelay: "0.4s",
    },
    [`${cls} ${cls}-dot ${cls}-dot-item:nth-child(3)`]: {
      bottom: 0,
      insetInlineEnd: 0,
      animationDelay: "0.8s",
    },
    [`${cls} ${cls}-dot ${cls}-dot-item:nth-child(4)`]: {
      bottom: 0,
      insetInlineStart: 0,
      animationDelay: "1.2s",
    },

    // size
    [`${cls}${cls}-sm ${cls}-dot`]: {
      fontSize: token.dotSizeSM,
      width: token.dotSizeSM,
      height: token.dotSizeSM,
    },
    [`${cls}${cls}-sm ${cls}-dot ${cls}-dot-item`]: {
      width: Math.floor(token.dotSizeSM / 2.4),
      height: Math.floor(token.dotSizeSM / 2.4),
    },
    [`${cls}${cls}-lg ${cls}-dot`]: {
      fontSize: token.dotSizeLG,
      width: token.dotSizeLG,
      height: token.dotSizeLG,
    },
    [`${cls}${cls}-lg ${cls}-dot ${cls}-dot-item`]: {
      width: Math.floor(token.dotSizeLG / 2.5),
      height: Math.floor(token.dotSizeLG / 2.5),
    },

    // text
    [`${cls} ${cls}-text`]: {
      fontSize: token.fontSize || "14px",
      paddingTop: "10px",
      color: token.spinTipColor,
    },

    [`${cls}-nested-loading ${cls} ${cls}-text`]: {
      position: "absolute",
      top: "50%",
      width: "100%",
      textShadow: "0 1px 2px #ffffff",
    },

    [`${cls}-nested-loading ${cls}${cls}-lg ${cls}-text`]: {
      paddingTop: Math.ceil(token.dotSizeLG * 0.6),
    },

    // nested spin
    [`${cls}-nested-loading`]: {
      position: "relative",
    },

    [`${cls}-nested-loading div ${cls}`]: {
      position: "absolute",
      top: 0,
      insetInlineStart: "0",
      zIndex: "4",
      display: "block",
      width: "100%",
      height: "100%", // x 设置minHeight?
      maxHeight: token.contentHeight,
    },

    // nested dot
    [`${cls}-nested-loading div ${cls} ${cls}-dot`]: {
      position: "absolute",
      top: "50%",
      insetInlineStart: "50%",
      margin: `${-token.dotSize / 2}px`,
    },
    [`${cls}-nested-loading div ${cls}-lg ${cls}-dot`]: {
      margin: `${-token.dotSizeLG / 2}px`,
    },
    [`${cls}-nested-loading div ${cls}-sm ${cls}-dot`]: {
      margin: `${-token.dotSizeSM / 2}px`,
    },

    // nested > container
    [`${cls}-nested-loading ${cls}-container`]: {
      position: "relative",
      transition: "opacity 0.3s",
    },

    [`${cls}-nested-loading ${cls}-container::after`]: {
      position: "absolute",
      top: 0,
      bottom: 0,
      insetInlineEnd: 0,
      insetInlineStart: 0,
      zIndex: "10",
      width: "100%",
      height: "100%",
      background: token.colorBgContainer || "#fff",
      opacity: "0",
      transition: "all 0.25s",
      content: "''",
      pointerEvents: "none",
    },

    // nested > blur
    [`${cls}-nested-loading ${cls}-blur`]: {
      clear: "both",
      opacity: "0.5",
      userSelect: "none",
      pointerEvents: "none",
    },
    [`${cls}-nested-loading ${cls}-blur::after`]: {
      opacity: "0.4",
      pointerEvents: "auto",
    },

    // fullscreen
    [`${cls}-fullscreen`]: {
      position: "fixed",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.45)", // token.colorBgMask,
      zIndex: token.zIndexPopupBase || "1000",
      inset: "0",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      opacity: "0",
      visibility: "hidden",
      transition: `all 0.2s`,
    },
    [`${cls}-fullscreen-show`]: {
      opacity: "1",
      visibility: "visible",
    },

    [`${cls}-fullscreen ${cls}-text`]: {
      color: "#fff", // token.colorTextLightSolid,
    },
    [`${cls}-fullscreen ${cls}-dot ${cls}-dot-item`]: {
      backgroundColor: "#fff", // token.colorWhite,
    },
  };
};
