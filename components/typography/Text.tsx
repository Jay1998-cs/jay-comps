import React from "react";
import omit from "rc-util/lib/omit";

import { BlockProps, EllipsisConfig } from "./Base";
import Base from "./Base";

export interface TextProps
  extends BlockProps<"span">,
    Omit<
      React.HTMLAttributes<HTMLSpanElement>,
      "type" | keyof BlockProps<"span">
    > {
  ellipsis?: boolean | Omit<EllipsisConfig, "expandable" | "row" | "onExpand">;
}

const Text: React.ForwardRefRenderFunction<HTMLSpanElement, TextProps> = (
  { ellipsis, ...restProps },
  ref
) => {
  const mergedEllipsis = React.useMemo(() => {
    if (ellipsis && typeof ellipsis === "object") {
      return omit(ellipsis as EllipsisConfig, ["expandable", "rows"]);
    }
    return ellipsis;
  }, [ellipsis]);

  return (
    <Base component="span" ref={ref} {...restProps} ellipsis={mergedEllipsis} />
  );
};

export default React.forwardRef(Text);
