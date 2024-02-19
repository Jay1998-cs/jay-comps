import { TreeToken } from ".";

export const genTreeNodeStyle = (token: TreeToken) => {
  const {
    componentCls: cls,
    nodeHeight = "24px",
    hoverBg,
    nodeSelectedBg,
  } = token;

  const treeNodeCls = `${cls} ${cls}-treenode`;

  return {
    [treeNodeCls]: {
      height: nodeHeight,
    },

    [`${treeNodeCls}:hover`]: {
      backgroundColor: hoverBg || "#fff",
    },

    [`${treeNodeCls}-selected`]: {
      backgroundColor: nodeSelectedBg || "#1677ff",
    },
  };
};
