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
      width: "50%",
      border: " 1px solid gray",
      padding: 30,
      margin: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...style,
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
    width: "100%",
    ...style,
  };
  return (
    <div className="dev-container" style={_style}>
      {children}
    </div>
  );
};

const TreePage = () => {
  const handleExpanded = (node, isExpanded, expandedKeys, e) => {
    console.log(
      `node ${node.key}, isExpanded: ${isExpanded}, expandedKeys: ${[
        ...expandedKeys,
      ]}`
    );
  };

  const handleChecked = (node, isChecked, checkedKeys, e) => {
    console.log(
      `node ${node.key}, isChecked: ${isChecked}, checkedKeys: ${[
        ...checkedKeys,
      ]}`
    );
  };

  return (
    <div className="dev-tree-page">
      <Vflex>
        <Card>
          <Tree
            treeData={treeData1}
            collapseAll={false}
            needCheckbox={true}
            onExpand={handleExpanded}
            onCheck={handleChecked}
          />
        </Card>
        <Card>
          <Tree
            treeData={createTreeData("0", 3, 3, 950000)}
            needCheckbox={false}
          />
        </Card>
      </Vflex>
    </div>
  );
};

export default TreePage;
