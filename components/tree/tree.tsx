import React, {
  MouseEvent,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import TreeNode, {
  CheckedStatus,
  DataNode,
  IconType,
  TreeNodeKey,
  TreeNodeKeys,
} from "./treeNode";
import classNames from "classnames";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";
import { getVisibleTreeRange, resolveTreeDataToList } from "./util";
import { debounce } from "throttle-debounce";
import {
  getCheckedKeys,
  getDescendantsCheckedKeys,
  setChildsUnChecked,
  getAncestorsCheckedKeys,
} from "./util/processCheckedStatus";
import {
  getAncestorsExpandedKeys,
  removeDescendantsExpanded,
} from "./util/processExpandedStatus";

export interface FieldNames {
  title?: string;
  _title?: string[]; // save to remove
  key?: string;
  children?: string;
}

export type ExpandAction = false | "click" | "doubleClick";

type TreeDataType = DataNode;

export type EventDataNode<TreeDataType> = {
  key: TreeNodeKey;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  loaded: boolean;
  loading: boolean;
  halfChecked: boolean;
  pos: string;
  active: boolean;
  // dragOver: boolean;
  // dragOverGapTop: boolean;
  // dragOverGapBottom: boolean;
} & TreeDataType;

export interface CheckInfo<TreeDataType extends DataNode> {
  event: "check";
  node: EventDataNode<TreeDataType>;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: TreeDataType[];
  checkedNodesPositions?: { node: TreeDataType; pos: string }[];
  halfCheckedKeys?: TreeNodeKeys;
}

export interface TreeProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode; // remove ？Tree组件不包裹内容
  treeData: TreeDataType[];
  visibleHeight?: number;
  selectable?: boolean;
  checkable?: boolean | React.ReactNode;
  disabled?: boolean;
  focusable?: boolean;
  showLine?: boolean;
  showIcon?: boolean;
  showLeafIcon?: { showLeafIcon: boolean | IconType };
  icon?: IconType;
  switcherIcon?: IconType;
  tabIndex?: number;
  multiple?: boolean; // 是否支持多选
  blockNode?: boolean; // ?
  activeKey?: TreeNodeKey | null; // ?
  checkStrictly?: boolean; // ?
  fieldNames?: FieldNames; // ?
  indentUnitSize?: number;

  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  defaultExpandAll?: boolean;
  expandAction?: ExpandAction;
  defaultExpandedKeys?: TreeNodeKeys;
  defaultCheckedKeys?: TreeNodeKeys;
  defaultSelectedKeys?: TreeNodeKeys;
  // expandedKeys?: Key[];
  // checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  // selectedKeys?: Key[];

  titleRender?: (node: TreeDataType) => React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLSpanElement>;
  onScroll?: React.UIEventHandler<HTMLElement>;
  onExpand?: (
    expandedKeys: TreeNodeKeys,
    info: {
      node: EventDataNode<TreeDataType>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }
  ) => void;
  onCheck?: (
    checked:
      | { checked: TreeNodeKeys; halfChecked: TreeNodeKeys }
      | TreeNodeKeys,
    info: CheckInfo<TreeDataType>
  ) => void;
  onSelect?: (
    selectedKeys: TreeNodeKeys,
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode<TreeDataType>;
      selectedNodes: TreeDataType[];
      nativeEvent: MouseEvent;
    }
  ) => void;
  onLoad?: (
    loadedKeys: TreeNodeKeys,
    info: {
      event: "load";
      node: EventDataNode<TreeDataType>;
    }
  ) => void;
  loadData?: (treeNode: EventDataNode<TreeDataType>) => Promise<any>;
  loadedKeys?: TreeNodeKeys; // work with loadData
  // draggable?: DraggableFn | boolean | DraggableConfig;
  // allowDrop?: AllowDrop<TreeDataType>;
  // dropIndicatorRender?: (props: {
  //   dropPosition: -1 | 0 | 1;
  //   dropLevelOffset: number;
  //   indent: number;
  //   prefixCls: string;
  //   direction: Direction;
  // }) => React.ReactNode;
  // onMouseEnter?: (info: NodeMouseEventParams<TreeDataType>) => void;
  // onMouseLeave?: (info: NodeMouseEventParams<TreeDataType>) => void;
  // onRightClick?: (info: {
  //   event: React.MouseEvent;
  //   node: EventDataNode<TreeDataType>;
  // }) => void;
}

export type TreeData = TreeDataType[];
export type TreeMap = Record<TreeNodeKey, DataNode>;
export type TreeList = DataNode[];
export type SetTreeNodeKeys = Set<TreeNodeKey>;

export const VIRTUAL_HEIGHT = 200; // 可见区域的上下缓冲区高度
export const TREE_NODE_HEIGHT = 28; // 24px(height) + 4px(padding-bottom)

// ================================== Tree ==================================
const Tree = forwardRef<HTMLDivElement, TreeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    treeData = [],
    visibleHeight = 400,
    indentUnitSize = 24,
    defaultCheckedKeys = [],
    defaultExpandedKeys = [],
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("tree", customizePrefixCls);

  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);

  // >>>>> process treeData
  const { treeList, treeMap } = useMemo(() => {
    return resolveTreeDataToList(treeData); // Memo缓存，减少重复计算
  }, [treeData]);

  // checked and expanded Keys
  treeList.forEach((treenode) => {
    if (treenode.isChecked) {
      defaultCheckedKeys.push(treenode.key);
    }
    if (treenode.isExpanded) {
      defaultExpandedKeys.push(treenode.key);
    }
  });

  const initialCheckedKeys = getCheckedKeys(
    new Set(defaultCheckedKeys),
    treeMap
  );
  const [checkedKeys, setCheckedKeys] = useState(initialCheckedKeys);

  const initialExpandedKeys = getAncestorsExpandedKeys(
    new Set(defaultExpandedKeys),
    treeMap
  );
  const [expandedKeys, setExpandedKeys] = useState(initialExpandedKeys);

  // : 死循环：useState(initialExpandedKeys); 只会初始调用，引用没变但内容变了
  // if (initialExpandedKeys !== expandedKeys) {
  //   setExpandedKeys(initialExpandedKeys);
  // }

  // >>>>> event handler
  // scrolling
  const handleTreeScroll = () => {
    setScrollTop(Number(scrollRef?.current?.scrollTop) || 0);
  };

  // click checkbox
  const handleCheckedStatus = (isChecked: boolean, node: DataNode) => {
    const { key: targetKey } = node;
    const newCheckedKeys = new Set(checkedKeys); // 创建新副本，触发state更新，使组件响应更新

    if (isChecked && !newCheckedKeys.has(targetKey)) {
      // 勾选当前节点
      newCheckedKeys.add(targetKey);
      // 勾选全部后代节点
      getDescendantsCheckedKeys(targetKey, newCheckedKeys, treeMap);
      // 更新父节点为全选或半选
      getAncestorsCheckedKeys(targetKey, newCheckedKeys, treeMap);
    } else if (!isChecked) {
      // 取消勾选当前节点
      newCheckedKeys.delete(targetKey);
      // 更新父节点为半选或未选
      const { parentKeys } = node;
      parentKeys?.forEach((pKey) => {
        if (newCheckedKeys.has(pKey)) {
          newCheckedKeys.delete(pKey);
        }
      });
      // 全部后代节点置为未选
      setChildsUnChecked(node, newCheckedKeys);
    }

    setCheckedKeys(newCheckedKeys); // 【更新state，触发组件更新】
    // x 待改 执行传入tree的回调函数
  };

  // click expanded switcher
  const handleExpandedStatus = (isExpanded: boolean, node: DataNode) => {
    const { childKeys } = node;
    const nexExpandedKeys = new Set(expandedKeys); // 创建副本，以更新state
    const has = nexExpandedKeys.has(node.key); // 确保节点未展开

    // 非叶节点expanded状态才有意义
    if (childKeys && childKeys.length) {
      if (isExpanded && !has) {
        // 展开，添加展开key即可(之后getVisibleTreeRange()会收集直接孩子来渲染)
        nexExpandedKeys.add(node.key);
        node.isExpanded = true; // 更新节点展开状态
      } else if (!isExpanded) {
        // 收起，移除所有后代节点
        node.isExpanded = false; // 更新节点展开状态
        removeDescendantsExpanded(node.key, treeMap, nexExpandedKeys);
      }

      setExpandedKeys(nexExpandedKeys);
      // x 待改 执行传入tree的回调函数
    }
  };

  // >>>> get checked status
  const traverseCheckedState = (traverseKeys: TreeNodeKey[]): CheckedStatus => {
    let isCheckedAll: boolean = true;
    let isCheckedSome: boolean = false;
    let checkedCount: number = 0;

    traverseKeys.forEach((key) => {
      if (!checkedKeys.has(key)) {
        isCheckedAll = false;

        const { childKeys } = treeMap[key] || {};
        if (childKeys && childKeys.length) {
          isCheckedSome =
            isCheckedSome || traverseCheckedState(childKeys) !== "none";
        }
      } else {
        ++checkedCount;
      }
    });

    return isCheckedAll
      ? "checked"
      : checkedCount || isCheckedSome
      ? "indeterminate"
      : "none";
  };

  const getCheckedStatus = (treenode: DataNode): CheckedStatus => {
    const nodeKey = treenode.key;
    if (checkedKeys.has(nodeKey)) {
      return "checked";
    } else {
      const childKeys = treenode.childKeys;
      let checkedState: CheckedStatus = "none";

      if (childKeys && childKeys.length) {
        checkedState = traverseCheckedState(childKeys);
      }

      return checkedState;
    }
  };

  // >>>>> className
  const treeClassName = classNames(prefixCls, className, hashId, cssVarCls);

  // >>>>> treeNodes
  const { renderedTreeNodes, treeTotalHeight, translateY } =
    getVisibleTreeRange(
      treeData,
      visibleHeight,
      TREE_NODE_HEIGHT,
      scrollTop,
      expandedKeys
    );

  console.log(expandedKeys);
  console.log(treeList);

  const treeNodesShown = renderedTreeNodes.map((node) => (
    <TreeNode
      key={node.key}
      data={node}
      indentUnitSize={indentUnitSize}
      checked={getCheckedStatus(node)}
      onChecked={handleCheckedStatus}
      expanded={expandedKeys.has(node.key)}
      onExpaned={handleExpandedStatus}
    />
  ));

  // console.log("renderedTreeNodes: ", renderedTreeNodes);

  // >>>>> render
  const needVirtualScroll = treeTotalHeight > visibleHeight ? true : false;
  const treeVisibleHeight = needVirtualScroll ? visibleHeight : treeTotalHeight;

  const tree = (
    <div
      ref={ref}
      className={treeClassName}
      style={{
        ...style,
        width: "100%",
        height: treeVisibleHeight,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "0", left: "0", right: "0" }}>
        <div
          ref={scrollRef}
          className="tree-visible-scroller"
          onScroll={debounce(17, handleTreeScroll)}
          style={
            needVirtualScroll
              ? { overflowY: "scroll", height: treeVisibleHeight }
              : undefined
          }
        >
          <div
            className="tree-virtual-full-container"
            style={{ height: treeTotalHeight }}
          >
            <div
              className="tree-visible-window"
              style={
                needVirtualScroll
                  ? {
                      transform: `translateY(${translateY}px)`,
                      height: treeVisibleHeight,
                    }
                  : undefined
              }
            >
              <div className={`${prefixCls}-render-wrapper`}>
                {treeNodesShown}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(tree);
  }
  return tree;
});

export default Tree;
