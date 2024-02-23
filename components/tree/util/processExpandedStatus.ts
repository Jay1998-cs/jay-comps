import { SetTreeNodeKeys, TreeList, TreeMap } from "../tree";
import { TreeNodeKey } from "../treeNode";

// key节点展开，其祖先节点全部展开
export function collectAncestorsExpandedKeys(
  key: TreeNodeKey,
  expandedKeys: SetTreeNodeKeys,
  treeMap: TreeMap
) {
  const { parentKeys } = treeMap[key];
  parentKeys?.forEach((pKey) => {
    expandedKeys.add(pKey); // Set会自动去重重复key(可以用set.hash()判断)
    collectAncestorsExpandedKeys(pKey, expandedKeys, treeMap);
  });
}

// export function getDescendantsExpandedKeys(
//   key: TreeNodeKey,
//   expandedKeys: SetTreeNodeKeys,
//   treeMap: TreeMap
// ) {}

// 将组件节点的key存储到expandedKeys集合
export function getAncestorsExpandedKeys(
  expandedKeys: SetTreeNodeKeys,
  treeMap: TreeMap
): SetTreeNodeKeys {
  // 一个节点展开，则其祖先节点全部展开
  expandedKeys.forEach((key) => {
    collectAncestorsExpandedKeys(key, expandedKeys, treeMap);
  });

  return expandedKeys;
}

// 移除key节点及后代的expanded状态
export function removeDescendantsExpanded(
  key: TreeNodeKey,
  treeMap: TreeMap,
  expandedKeys: SetTreeNodeKeys,
  collapseAll: boolean
) {
  if (expandedKeys.has(key)) {
    expandedKeys.delete(key);

    // 折叠所有后代(collapseAll === true)
    const { childKeys } = treeMap[key];
    if (collapseAll && childKeys?.length) {
      childKeys.forEach((cKey) => {
        removeDescendantsExpanded(cKey, treeMap, expandedKeys, collapseAll);
      });
    }
  }
}

// 遍历treeList，将isExpaned为true(展开)的节点key保存到expandedKeys列表
export function getTreeListExpandedKeys(
  treeList: TreeList,
  expandedKeys: SetTreeNodeKeys
) {
  treeList.forEach((node) => {
    if (node.isExpanded) {
      expandedKeys.add(node.key);
    }
  });
  return expandedKeys;
}
