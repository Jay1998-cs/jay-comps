import React from "react";

import { RowProps } from "../row";
import {
  Breakpoint,
  ScreenMap,
  responsiveArray,
} from "../../_util/responsiveObserver";

/**
 *
 * @param oriProp align 或 justify 的取值, 类型为字符串或对象, 对象用于响应式屏幕, 如{sm:'top', xs:'bottom'}
 * @param screen 屏幕尺寸表{ xs: boolean, sm: boolean, ...}，记录当前屏幕大小(值为true的对应key)
 * @returns 返回适用于当前屏幕尺寸的 align 或 justify(取决于传入的oriProp类型) 的取值
 */
export function useMergePropByScreen(
  oriProp: RowProps["align"] | RowProps["justify"],
  screen: ScreenMap
) {
  const [prop, setProp] = React.useState(
    typeof oriProp === "string" ? oriProp : ""
  );

  const calcMergeALignOrJustify = () => {
    // oriProp为字符串时
    if (typeof oriProp === "string") {
      setProp(oriProp);
      return;
    }
    // oriProp为对象时(用于响应式屏幕)
    if (typeof oriProp !== "object") {
      return;
    }
    for (let i = 0; i < responsiveArray.length; ++i) {
      const breakpoint: Breakpoint = responsiveArray[i]; // 当前屏幕尺寸，如sm
      if (!screen[breakpoint]) {
        continue; // 跳过不匹配项
      }
      const curVal = oriProp[breakpoint]; // 适用于当前屏幕尺寸的prop
      if (curVal !== undefined) {
        setProp(curVal);
        return;
      }
    }
  };

  React.useEffect(() => {
    calcMergeALignOrJustify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(oriProp), screen]);

  return prop;
}
