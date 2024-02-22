import { TreeMap, SetTreeNodeKeys } from "../tree";
import { DataNode, TreeNodeKey } from "../treeNode";

// 若后代全勾选，则parent节点置为全选状态，添加到选中集合
export function getAncestorsCheckedKeys(
  targtKey: TreeNodeKey,
  checkedKeys: SetTreeNodeKeys,
  treeMap: TreeMap
) {
  const { parentKeys } = treeMap[targtKey] || {};
  if (parentKeys !== undefined) {
    // 【倒序/自底向上】处理每一个父节点，因为祖先节点是否全选/半选依赖于后代状态
    for (let i = parentKeys.length - 1; i >= 0; --i) {
      const pKey = parentKeys[i];
      const { childKeys } = treeMap[pKey];
      let isCheckedAll = true;
      // 判断后代是否全部选中【顺序/自顶向下，若一个后代未选中则祖先不可能全选】
      if (childKeys && childKeys.length) {
        for (let j = 0, cLen = childKeys.length; j < cLen; ++j) {
          if (!checkedKeys.has(childKeys[j])) {
            isCheckedAll = false;
            break;
          }
        }
      }
      // 后代全选，则父节点更新为全选状态
      if (isCheckedAll) {
        checkedKeys.add(pKey);
      } else {
        break;
      }
    }
  }
}

// 将标识为key的节点及其后代添加到选中集合
export function getDescendantsCheckedKeys(
  key: TreeNodeKey,
  checkedKeys: SetTreeNodeKeys,
  treeMap: TreeMap
) {
  const { childKeys } = treeMap[key] || {};
  if (childKeys && childKeys.length) {
    childKeys.forEach((childKey) => {
      if (!checkedKeys.has(childKey)) {
        checkedKeys.add(childKey);
      }
      getDescendantsCheckedKeys(childKey, checkedKeys, treeMap);
    });
  }
}

// 遍历checkedKeys，更新每一个节点的选中状态
export function getCheckedKeys(
  checkedKeys: SetTreeNodeKeys,
  treeMap: TreeMap
): SetTreeNodeKeys {
  checkedKeys.forEach((key) => {
    getAncestorsCheckedKeys(key, checkedKeys, treeMap);
    getDescendantsCheckedKeys(key, checkedKeys, treeMap);
  });

  return checkedKeys;
}

// 将节点的后代全部置为未选状态
export function setChildsUnChecked(
  node: DataNode,
  checkedKeys: SetTreeNodeKeys
) {
  const { children } = node;
  if (children && children.length) {
    children.forEach((child) => {
      if (checkedKeys.has(child.key)) {
        checkedKeys.delete(child.key);
      }
      setChildsUnChecked(child, checkedKeys);
    });
  }
}
