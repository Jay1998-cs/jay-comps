import { GridToken } from ".";

export const genGridRowStyle = (token: GridToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: "flex",
      flexFlow: "row wrap",
      minWidth: 0,
    },
    [`${componentCls}-no-wrap`]: {
      flexWrap: "no-wrap",
    },
    [`${componentCls}::before`]: {
      display: "flex",
    },
    [`${componentCls}::after`]: {
      display: "flex",
    },
    // justify
    [`${componentCls}-start`]: {
      justifyContent: "flex-start",
    },
    [`${componentCls}-center`]: {
      justifyContent: "center",
    },
    [`${componentCls}-end`]: {
      justifyContent: "flex-end",
    },
    [`${componentCls}-space-between`]: {
      justifyContent: "space-between",
    },
    [`${componentCls}-space-around`]: {
      justifyContent: "space-around",
    },
    [`${componentCls}-space-evenly`]: {
      justifyContent: "space-evenly",
    },
    // align
    [`${componentCls}-top`]: {
      alignItems: "flex-start",
    },
    [`${componentCls}-middle`]: {
      alignItems: "center",
    },
    [`${componentCls}-bottom`]: {
      alignItems: "flex-end",
    },
    [`${componentCls}-stretch`]: {
      alignItems: "stretch",
    },
  };
};
