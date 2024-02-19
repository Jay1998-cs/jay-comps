import React from "react";

import { Tree } from "../../components";
import { treeData1, createTreeData } from "./tree-data";

// import TreeNode from "../../components/tree/treeNode";
// const TreeNodeDev = () => {
//   return <TreeNode title="0">item</TreeNode>;
// };

const Vflex = ({ children, style }) => {
  const _style = {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    ...style,
  };
  return <div style={_style}>{children}</div>;
};

const TreePage = () => {
  return (
    <div className="dev-tree-page">
      <Vflex>
        <Tree treeData={treeData1} />
        <Tree treeData={createTreeData()} />
      </Vflex>
    </div>
  );
};

export default TreePage;
