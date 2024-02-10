import Row from "./row";
import Col from "./col";

import useInternalBreakpoint from "./hooks/useBreakpoint";

// Do not export params
export function useBreakpoint() {
  return useInternalBreakpoint();
}

export type { ColProps, ColSize } from "./col";
export type { RowProps } from "./row";

const Grid = {
  Col,
  Row,
};
export default Grid;
