import React from "react";

export const treeData1 = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        disabled: true,
        children: [
          {
            title: "0-0-0-0",
            key: "0-0-0-0",
            disableCheckbox: true,
          },
          {
            title: "leaf 0-0-0-1",
            key: "0-0-0-1",
            isChecked: true,
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: <span style={{ color: "#1677ff" }}>leaf 0-0-1</span>,
            key: "0-0-1-0",
          },
          {
            title: "leaf 0-0-1-1",
            key: "0-0-1-1",
            children: [
              {
                title: "0-0-1-1-0",
                key: "0-0-1-1-0",
                isChecked: true,
              },
              {
                title: "leaf 0-0-1-1-1",
                key: "0-0-1-1-1",
                isChecked: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

// tree节点
function createTreeNode(key, title, label) {
  const _key = key ? key : String(Math.random()).slice(2, 8);
  return {
    key: _key,
    title: _key, // `title-${_key}`,
    children: null,
  };
}

/**
 * @des 生成treeData
 * @params count 表示tree节点的数量
 */
export function createTreeData(path = "0", level = 3, count = 2) {
  const list = [];

  for (let i = 0; i < count; ++i) {
    const key = `${path}-${i}`;
    const treeNode = createTreeNode(key);

    if (level === 1 && key === "0-0-0-0") {
      treeNode.children = createTreeData(key, level - 1, 10);
    } else if (level > 0) {
      treeNode.children = createTreeData(key, level - 1);
    }

    list.push(treeNode);
  }

  return list;
}