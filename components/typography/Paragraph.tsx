import React from "react";

import type { BlockProps } from "./Base";
import Base from "./Base";

export interface paragraphProps
  extends BlockProps<"div">,
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "type" | keyof BlockProps<"div">
    > {}

const Paragraph = React.forwardRef<HTMLElement, paragraphProps>(
  (props, ref) => {
    return <Base component="div" ref={ref} {...props} />;
  }
);

export default Paragraph;
