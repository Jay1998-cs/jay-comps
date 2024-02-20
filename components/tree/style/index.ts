import { TokenType, genComponentStyleHook } from "../../theme";
import { genTreeNodeStyle, genTreeStyle } from "./genStyleByToken";

export interface TreeToken extends TokenType {
  componentCls: string;

  nodeHoverBg: string;
  nodeSelectedBg: string;
  nodeHeight: string;
}

const useStyle = genComponentStyleHook("tree", (token) => {
  const treeToken = Object.assign(token, {
    nodeHoverBg: "rgba(0,0,0,0.04)",
    nodeSelectedBg: "#e6f4ff",
    nodeHeight: "24px",
  });

  return [genTreeStyle(treeToken), genTreeNodeStyle(treeToken)];
});

export default useStyle;
