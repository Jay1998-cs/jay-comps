import { SetTreeNodeKeys, TreeData, TreeList, VIRTUAL_HEIGHT } from "../tree";
import { DataNode, TreeNodeKey, TreeNodeTitle } from "../treeNode";

export type TreeMap = Record<TreeNodeKey, DataNode>;

/**
 * @description 平铺treeData并收集信息
 * @returns treeList, treeMap, treetotalHeight, translateY
 */
export function resolveTreeDataToList(treeData: TreeData) {
  const treeList: TreeList = [];
  const treeMap: TreeMap = {};

  function traverseData(
    treeData: TreeData,
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

/**
 *
 * @param treeData: 树组件的输入数据
 * @param scrollTop: 滚动条滚动的Top值，比拟用户视线
 * @param visibleHeight: 可视区域高度
 * @param itemHeight: 渲染树的单项(treeNode)高度
 * @param expandedArrIds: 被收起的节点Key
 * @returns
 */
export function getVisibleTreeRange(
  treeData: TreeData,
  visibleHeight: number,
  itemHeight: number,
  scrollTop: number = 0,
  expandedArrIds: SetTreeNodeKeys
) {
  // 注：这里的可视区域【包含上下缓冲区】
  let totalHeight = 0; // 树形结构内容的总高度；
  let translateY = 0; // 纵向需要被移动的值
  const renderedTreeNodes: TreeData = []; // 可视区待渲染的item

  // 0: 未进入可视区域阶段(初始默认状态)；1: 处于可视区域阶段；2: 离开可视区域阶段
  let currentStep = 0;

  // 递归解析树型结构的数据，计算整体高度并找出需要在可视区域内展示的内容
  workLoop(treeData);

  function workLoop(treeNodes: TreeData) {
    // 注意：初始时遍历最外层节点，这些节点必需渲染
    treeNodes.forEach((node) => {
      // 遍历每一项(即item表示的是treeNode)
      const key = node.key; // treeNode的标识key值
      const children = node.children; // treeNode的后代
      totalHeight += itemHeight; // 累加item高度计算当前高度和总高度

      if (currentStep === 0) {
        // 未进入可视区域【work：计算偏移量】
        if (scrollTop > totalHeight + VIRTUAL_HEIGHT) {
          // => 1).未进入可视区域，计算可视区域的垂直偏移量
          translateY += itemHeight;
        } else {
          // => 2).进入可视区域，已越过界线(隐藏/显示)
          currentStep += 1;
          renderedTreeNodes.push(node); // 第一个待渲染的item(首个进入可视区的项)
        }
      } else if (currentStep === 1) {
        // ===> 3).处于可视区域阶段【work：收集待渲染的项】
        if (!renderedTreeNodes.find((rNode) => rNode.key === node.key)) {
          renderedTreeNodes.push(node);
        }
        // ===> 4).超出可视区域范围，结束当前阶段
        if (totalHeight >= scrollTop + visibleHeight + VIRTUAL_HEIGHT) {
          currentStep += 1;
        }
      }

      // 若当前节点是展开状态且存在后代，则收集待渲染的后代节点
      if (children && children.length && expandedArrIds.has(key)) {
        workLoop(children);
      }
    });
  }

  // 返回可视区域信息
  return {
    renderedTreeNodes,
    translateY,
    treeTotalHeight: totalHeight,
  };
}

// export const traverseChildCheckedState = (
//   traverseKeys: Set<Key>
// ): CheckedStatus => {
//   let checkedState: CheckedStatus = "none";
//   let checkedCount: number = 0;
//   let isCheckedAll: boolean = false;

//   traverseKeys.forEach((key) => {
//     if (!checkedKeys.has(key)) {
//       isCheckedAll = false;

//     }
//   });

//   return checkedState;
// };
