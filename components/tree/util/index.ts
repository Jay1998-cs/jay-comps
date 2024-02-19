import { TreeDataType } from "../tree";
import { DataNode, Key, TreeNodeTitle } from "../treeNode";

// 平铺treeData并收集嵌套信息
export function resolveTreeDataToList(treeData: TreeDataType[]) {
  const treeList: DataNode[] = [];
  const treeMap: Record<Key, DataNode> = {};

  function traverseData(
    treeData: TreeDataType[],
    pKeys: string[],
    pTitles: TreeNodeTitle[],
    pLevels: number[]
  ) {
    const parentKeys = pKeys || [];
    const parentTitles = pTitles || [];
    const levels = pLevels || [];

    return treeData.map((treeNode, index) => {
      // 保存当前层树节点信息
      const levs = [...levels, index]; // 层级(序号)信息
      treeNode.pos = levs.join("_"); // 位置信息
      if (!treeNode.key) {
        treeNode.key = treeNode.pos;
      }
      treeNode.parentKeys = parentKeys;
      treeNode.parentTitles = parentTitles;
      treeList.push(treeNode);
      treeMap[treeNode.key] = treeNode;
      // 处理下一层子节点
      if (treeNode.children && treeNode.children.length) {
        const newParentKeys = [...parentKeys, String(treeNode.key)];
        const newParentTitles = [...parentTitles, treeNode.title];

        treeNode.childKeys = traverseData(
          treeNode.children,
          newParentKeys,
          newParentTitles,
          levs
        );
      }
      // 返回
      return treeNode.key;
    });
  }

  traverseData(treeData, [], [], []);

  return { treeList, treeMap };
}
