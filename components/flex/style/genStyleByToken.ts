import type { FlexToken } from ".";

const genFlexStyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {},
  };
};

const genGaptyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {},
  };
};

const genWraptyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {},
  };
};

const genAlignItemsStyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {},
  };
};

const genJustifyContentStyle = (token: FlexToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {},
  };
};

export {
  genFlexStyle,
  genGaptyle,
  genWraptyle,
  genAlignItemsStyle,
  genJustifyContentStyle,
};
