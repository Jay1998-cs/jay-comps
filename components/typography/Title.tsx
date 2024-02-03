import React from "react";

import type { BlockProps } from "./Base";
import Base from "./Base";

const TITLE_ELE_LIST = [1, 2, 3, 4, 5] as const;

export interface TitlePorps
  extends Omit<BlockProps<"h1" | "h2" | "h3" | "h4" | "h5">, "strong">,
    Omit<
      React.HTMLAttributes<HTMLHeadElement>,
      "type" | keyof BlockProps<"h1" | "h2" | "h3" | "h4" | "h5">
    > {
  level?: (typeof TITLE_ELE_LIST)[number];
}

const Title = React.forwardRef<HTMLElement, TitlePorps>((props, ref) => {
  const { level = 1, ...restProps } = props;
  let component: keyof JSX.IntrinsicElements = "h1";

  if (TITLE_ELE_LIST.includes(level)) {
    component = `h${level}`;
  }

  return <Base ref={ref} component={component} {...restProps} />;
});

export default Title;
