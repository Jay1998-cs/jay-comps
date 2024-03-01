import React, { useState } from "react";

import { Tree } from "../../components";
import { createTreeData, treeData1 } from "./tree-data";

const Card = ({ children, style = {} }) => (
  <div
    className="dev-card"
    style={{
      width: "50%",
      border: " 1px solid gray",
      padding: 30,
      margin: "10px 0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

const HFlex = ({ children }) => {
  return <div style={{ display: "flex", gap: 10 }}>{children}</div>;
};

// >>>>> page
const TreePage = () => {
  const [collapseAll, setCollapseAll] = useState(false);
  const [needCheckbox, setNeedCheckbox] = useState(true);

  // handler
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

  // render
  return (
    <div className="dev-tree-page">
      <h1>tree</h1>
      <div>
        <h3>tree的基本用法</h3>
        <ul>
          <li>
            visibleHeight属性设置tree的可视区高度(默认400px)，tree高度超过该值时触发虚拟滚动
          </li>
          <li>indentUnitSize属性设置后代节点的缩进(默认24px)</li>
          <li>defaultCheckedKeys、defaultExpandedKeys数组设置初始节点状态</li>
          <li>needCheckbox布尔属性控制是否需要checkbox</li>
          <li>collapseAll布尔属性控制展开节点时是否保持其后代的展开状态</li>
          <li>onExpand、onCheck触发展开、收起的回调函数，得到相关状态</li>
        </ul>
        <HFlex>
          <button
            onClick={() => {
              setCollapseAll((pre) => !pre);
            }}
          >
            {`collapseAll:${collapseAll}`}
          </button>
          <button
            onClick={() => {
              setNeedCheckbox((pre) => !pre);
            }}
          >
            {`needCheckbox: ${needCheckbox}`}
          </button>
        </HFlex>
        <Card>
          <Tree
            visibleHeight={200}
            treeData={treeData1}
            collapseAll={collapseAll}
            needCheckbox={needCheckbox}
            onExpand={handleExpanded}
            onCheck={handleChecked}
          />
        </Card>
      </div>

      <div>
        <h3>高性能支持百万级节点的tree</h3>
        <ul>
          <li>【Tip】展开0-0下的后代0-0-0-0节点滚动查看海量节点渲染</li>
          <li>运用虚拟列表滚动方法，只渲染可视窗口内的节点，减少渲染开销</li>
          <li>使用防抖技术debounce，避免极短时间内频繁渲染，提高性能</li>
          <li>当tree高度超过可视区高度时自动触发虚拟滚动列表</li>
        </ul>
        <Card>
          <Tree
            treeData={createTreeData("0", 3, 3, 950000)}
            needCheckbox={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default TreePage;
