import { unit } from "../../_util/tools";
import { GridColToken, GridRowToken } from ".";

// >>>>> Row
export const genGridRowStyle = (token: GridRowToken) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: "flex",
      flexFlow: "row wrap",
      minWidth: 0,
      boxSizing: "border-box",
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

// >>>>> Col
export const genGridColSharedStyle = (token: GridColToken) => {
  const { componentCls } = token;

  return {
    // Grid system
    [componentCls]: {
      position: "relative",
      maxWidth: "100%",
      minHeight: 1, // Prevent columns from collapsing when empty
      boxSizing: "border-box", // 【注意】设置盒子尺寸而不是内容
    },
  };
};

// >>>>> 24栅格布局
export const genGridColReactiveStyle = (
  token: GridColToken,
  sizeCls: string
) => {
  const { componentCls, gridColumns = 24 } = token;
  const cls =
    sizeCls === "" || sizeCls === undefined
      ? `${componentCls}`
      : `${componentCls}-${sizeCls}`; // 如 jay-col-md

  const colStyleObj: any = {};

  for (let i = 24; i >= 0; i--) {
    if (i === 0) {
      colStyleObj[`${cls}-${i}`] = { display: "none" };
      colStyleObj[`${cls}-push-${i}`] = { insetInlineStart: "auto" };
      colStyleObj[`${cls}-pull-${i}`] = { insetInlineEnd: "auto" };
      colStyleObj[`${cls}-offset-${i}`] = { marginInlineStart: 0 };
      colStyleObj[`${cls}-order-${i}`] = { order: 0 };
      colStyleObj[`${componentCls}-push-${i}`] = { insetInlineStart: "auto" };
      colStyleObj[`${componentCls}-pull-${i}`] = { insetInlineEnd: "auto" };

      // 处理类似 xs: {flex: 50%} 的情况，此时flex值存储在style标签(css变量)
      if (sizeCls !== undefined && sizeCls !== "") {
        if (cls.startsWith(".")) {
          const prefixCls = cls.slice(1); // 注意: componentCls如".jay-col"，去掉"."
          colStyleObj[`${cls}-flex`] = {
            flex: `var(--${prefixCls}-flex)`, // 引用内联style中的css变量(在col文件中设置)
          };
        }
      }
    } else {
      const flexBasis = `${(i / gridColumns) * 100}%`; // col所占空间
      colStyleObj[`${cls}-${i}`] = {
        display: "block",
        flex: `0 0 ${flexBasis}`,
        maxWidth: flexBasis,
      };
      colStyleObj[`${cls}-push-${i}`] = {
        insetInlineStart: flexBasis,
      };
      colStyleObj[`${cls}-pull-${i}`] = {
        insetInlineEnd: flexBasis,
      };
      colStyleObj[`${cls}-offset-${i}`] = {
        marginInlineStart: flexBasis,
      };
      colStyleObj[`${cls}-order-${i}`] = { order: `${i}` };
    }
  }

  return colStyleObj;
};

// >>>>> 媒体查询-响应式屏幕尺寸
const genGridMediaStyle = (
  token: GridColToken,
  screenSize: number,
  sizeCls: string
) => ({
  [`@media (min-width: ${unit(screenSize)})`]: {
    ...genGridColReactiveStyle(token, sizeCls),
  },
});

export const genDiffScreenMediaStyle = (token: GridColToken) => {
  const gridMediaSizesMap = {
    sm: token.screenSMMin,
    md: token.screenMDMin,
    lg: token.screenLGMin,
    xl: token.screenXLMin,
    xxl: token.screenXXLMin,
  } as const;

  type GridMediaSize = keyof typeof gridMediaSizesMap;

  return Object.keys(gridMediaSizesMap)
    .map((size: GridMediaSize) =>
      genGridMediaStyle(token, Number(gridMediaSizesMap[size]), size)
    )
    .reduce((pre, cur) => ({ ...pre, ...cur }), {});
};
