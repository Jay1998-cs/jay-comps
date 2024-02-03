import React from "react";

import type { BlockProps } from "./Base";
import Base from "./Base";

export interface LinkProps
  extends BlockProps<"a">,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "type" | keyof BlockProps<"a">
    > {
  ellipsis?: boolean;
}

const Link = React.forwardRef<HTMLElement, LinkProps>((props, ref) => {
  const { ellipsis, rel, ...restProps } = props;

  const mergedProps = {
    ...restProps,
    rel:
      rel === undefined && restProps.target === "_blank"
        ? "noopener noreferrer"
        : rel,
  };

  return (
    <Base component="a" ref={ref} ellipsis={!!ellipsis} {...mergedProps} />
  );
});

export default Link;
