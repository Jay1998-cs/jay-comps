import React from "react";

import { Tree } from "../../components";
import { createTreeData } from "./tree-data";

// import TreeNode from "../../components/tree/treeNode";
// const TreeNodeDev = () => {
//   return <TreeNode title="0">item</TreeNode>;
// };

const Card = ({ children }) => (
  <div
    className="dev-card"
    style={{
      border: " 1px solid gray",
      padding: 30,
      margin: 40,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

const Vflex = ({ children, style }) => {
  const _style = {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    width: "50%",
    ...style,
  };
  return (
    <div className="dev-container" style={_style}>
      {children}
    </div>
  );
};

const TreePage = () => {
  return (
    <div className="dev-tree-page">
      <Card>
        <Vflex>
          <Tree treeData={createTreeData()} />
        </Vflex>
      </Card>
    </div>
  );
};

export default TreePage;
