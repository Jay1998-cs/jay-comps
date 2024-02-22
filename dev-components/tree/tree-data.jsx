export const treeData1 = [
  {
    title: "0-0",
    key: "0-0",
    isExpanded: true,
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        disabled: true,
        children: [
          {
            title: "0-0-0-0",
            key: "0-0-0-0",
            disableCheckbox: true,
          },
          {
            title: "0-0-0-1",
            key: "0-0-0-1",
            isChecked: true,
          },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          {
            title: "0-0-1-0",
            key: "0-0-1-0",
            children: [
              {
                title: "0-0-1-0-0",
                key: "0-0-1-0-0",
              },
              {
                title: "0-0-1-0-1",
                key: "0-0-1-0-1",
                children: [
                  {
                    title: "0-0-1-0-1-0",
                    key: "0-0-1-0-1-0",
                  },
                ],
              },
            ],
          },
          {
            title: "0-0-1-1",
            key: "0-0-1-1",
            children: [
              {
                title: "0-0-1-1-0",
                key: "0-0-1-1-0",
                isChecked: false,
              },
              {
                title: "0-0-1-1-1",
                key: "0-0-1-1-1",
                isChecked: true,
                isExpanded: true,
                children: [
                  { title: "0-0-1-1-1-0", key: "0-0-1-1-1-0" },
                  { title: "0-0-1-1-1-1", key: "0-0-1-1-1-1" },
                ],
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
export function createTreeData(path = "0", level = 3, count = 2, MAX = 10) {
  const list = [];

  for (let i = 0; i < count; ++i) {
    const key = `${path}-${i}`;
    const treeNode = createTreeNode(key);

    if (level === 1 && key === "0-0-0-0") {
      treeNode.children = createTreeData(key, level - 1, MAX);
    } else if (level > 0) {
      treeNode.children = createTreeData(key, level - 1);
    }

    list.push(treeNode);
  }

  return list;
}
