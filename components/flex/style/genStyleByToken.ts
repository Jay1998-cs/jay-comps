import type { FlexToken } from ".";
import {
  alignItemsValues,
  flexWrapValues,
  justifyContentValues,
} from "../genFlexClassNames";

const genFlexStyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: "flex",
    },
    [`${componentCls}-vertical`]: {
      flexDirection: "column",
    },
    [`${componentCls}-rtl`]: {
      direction: "rtl",
    },
  };
};

const genGaptyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-gap-small`]: {
      gap: token.flexGapSM || "8px",
    },
    [`${componentCls}-gap-middle`]: {
      gap: token.flexGap || "16px",
    },
    [`${componentCls}-gap-large`]: {
      gap: token.flexGapLG || "24px",
    },
  };
};

const genJustifyContentStyle = (token: FlexToken) => {
  const { componentCls } = token;
  const justifyStyle: any = {};

  justifyContentValues.forEach((val) => {
    justifyStyle[`${componentCls}-justify-${val}`] = { justifyContent: val };
  });

  return justifyStyle;
};

const genAlignItemsStyle = (token: FlexToken) => {
  const { componentCls } = token;
  const alignStyle: any = {};

  alignItemsValues.forEach((val) => {
    alignStyle[`${componentCls}-align-${val}`] = { alignItems: val };
  });

  return alignStyle;
};

const genWraptyle = (token: FlexToken) => {
  const { componentCls } = token;
  const wrapStyle: any = {};

  flexWrapValues.forEach((val) => {
    wrapStyle[`${componentCls}-wrap-${val}`] = { flexWrap: val };
  });

  return wrapStyle;
};

export {
  genFlexStyle,
  genGaptyle,
  genAlignItemsStyle,
  genJustifyContentStyle,
  genWraptyle,
};
