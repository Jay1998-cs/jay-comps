import React from "react";

import { Tree } from "../../components";
import { createTreeData, treeData1 } from "./tree-data";

// import TreeNode from "../../components/tree/treeNode";
// const TreeNodeDev = () => {
//   return <TreeNode title="0">item</TreeNode>;
// };

const Card = ({ children, style = {} }) => (
  <div
    className="dev-card"
    style={{
      ...style,
      border: " 1px solid gray",
      padding: 30,
      margin: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

// const Vflex = ({ children, style }) => {
//   const _style = {
//     display: "flex",
//     flexDirection: "column",
//     gap: 40,
//     width: "100%",
//     ...style,
//   };
//   return (
//     <div className="dev-container" style={_style}>
//       {children}
//     </div>
//   );
// };

const TreePage = () => {
  return (
    <div className="dev-tree-page">
      <Card style={{ width: "50%" }}>
        {/* <Tree treeData={createTreeData("0", 3, 5)} /> */}
        <Tree treeData={treeData1} />
      </Card>
    </div>
  );
};

export default TreePage;
