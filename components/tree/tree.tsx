import React, {
  MouseEvent,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import TreeNode, { CheckedStatus, DataNode, IconType, Key } from "./treeNode";
import classNames from "classnames";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";
import { getVisibleTreeRange, resolveTreeDataToList } from "./util";
import { debounce } from "throttle-debounce";

export type TreeDataType = DataNode;

export interface FieldNames {
  title?: string;
  _title?: string[]; // save to remove
  key?: string;
  children?: string;
}

export type ExpandAction = false | "click" | "doubleClick";

export type EventDataNode<TreeDataType> = {
  key: Key;
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
  halfCheckedKeys?: Key[];
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
  activeKey?: Key | null; // ?
  checkStrictly?: boolean; // ?
  fieldNames?: FieldNames; // ?
  indentUnitSize?: number;

  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  defaultExpandAll?: boolean;
  expandAction?: ExpandAction;
  defaultExpandedKeys?: Key[];
  defaultCheckedKeys?: Key[];
  defaultSelectedKeys?: Key[];
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
    expandedKeys: Key[],
    info: {
      node: EventDataNode<TreeDataType>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }
  ) => void;
  onCheck?: (
    checked: { checked: Key[]; halfChecked: Key[] } | Key[],
    info: CheckInfo<TreeDataType>
  ) => void;
  onSelect?: (
    selectedKeys: Key[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode<TreeDataType>;
      selectedNodes: TreeDataType[];
      nativeEvent: MouseEvent;
    }
  ) => void;
  onLoad?: (
    loadedKeys: Key[],
    info: {
      event: "load";
      node: EventDataNode<TreeDataType>;
    }
  ) => void;
  loadData?: (treeNode: EventDataNode<TreeDataType>) => Promise<any>;
  loadedKeys?: Key[]; // work with loadData
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

export const VIRTUAL_HEIGHT = 200; // 可见区域的上下缓冲区高度
export const TREE_NODE_HEIGHT = 28; // 24px(height) + 4px(padding-bottom)

// ==========================================================================
type TreMap = Record<Key, DataNode>;

// 若后代全勾选，则parent节点置为全选状态，添加到选中集合
function updateParentsCheckedState(
  key: Key,
  checkedKeys: Set<Key>,
  treeMap: TreMap
) {
  const { parentKeys } = treeMap[key] || {};
  if (parentKeys !== undefined) {
    // 处理每一个父节点
    for (let i = 0, pLen = parentKeys.length; i < pLen; ++i) {
      const parentKey = parentKeys[i];
      const { childKeys } = treeMap[parentKey];
      let isCheckedAll = true;
      // 判断后代是否全部选中
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
        checkedKeys.add(parentKey);
      } else {
        break;
      }
    }
  }
}

// 将标识为key的节点及其后代添加到选中集合
function setChildsChecked(key: Key, checkedKeys: Set<Key>, treeMap: TreMap) {
  const { childKeys } = treeMap[key] || {};
  if (childKeys && childKeys.length) {
    childKeys.forEach((childKey) => {
      if (!checkedKeys.has(childKey)) {
        checkedKeys.add(childKey);
      }
      setChildsChecked(childKey, checkedKeys, treeMap);
    });
  }
}

function getCheckedKeys(checkedKeys: Set<Key>, treeMap: TreMap): Set<Key> {
  checkedKeys.forEach((key) => {
    updateParentsCheckedState(key, checkedKeys, treeMap);
    setChildsChecked(key, checkedKeys, treeMap);
  });

  return checkedKeys;
}

// ================================== Tree ==================================
const Tree = forwardRef<HTMLDivElement, TreeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    treeData = [],
    visibleHeight = 300,
    indentUnitSize = 24,
    defaultCheckedKeys = [],
    defaultExpandedKeys = [],
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("tree", customizePrefixCls);

  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const scrollRef = useRef<HTMLDivElement>(null);

  // >>>>> states
  const [scrollTop, setScrollTop] = useState<number>(0);

  // const [expandedKeys, setExpandedKeys] = useState(
  //   new Set([...defaultExpandedKeys])
  // );

  // >>>>> process treeData
  const { treeList, treeMap } = useMemo(() => {
    return resolveTreeDataToList(treeData);
  }, [treeData]);

  treeList.forEach((treenode) => {
    if (treenode.isChecked) {
      defaultCheckedKeys.push(treenode.key);
    }
  });
  const initialCheckedKeys = useMemo(
    () => getCheckedKeys(new Set([...defaultCheckedKeys]), treeMap),
    [defaultCheckedKeys, treeMap]
  );
  const [checkedKeys, setCheckedKeys] = useState(initialCheckedKeys);
  console.log("checkedKeys: ", checkedKeys);

  const expandedKeys = new Set([...defaultExpandedKeys]);

  // >>>>> event handler
  const handleCheckedStatus = (
    isChecked: boolean,
    checkedState: CheckedStatus,
    dataNode: DataNode
  ) => {
    if (checkedState === "none") {
    } else {
    }
  };

  // scroll
  const handleTreeScroll = () => {
    setScrollTop(Number(scrollRef?.current?.scrollTop) || 0);
  };

  // >>>> checked
  const traverseCheckedState = (traverseKeys: Key[]): CheckedStatus => {
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

      if (childKeys && checkedKeys.size) {
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
      treeList,
      visibleHeight,
      TREE_NODE_HEIGHT,
      scrollTop,
      expandedKeys
    );

  const treeNodesShown = renderedTreeNodes.map((node) => (
    <TreeNode
      key={node.key}
      data={node}
      indentUnitSize={indentUnitSize}
      onChecked={handleCheckedStatus}
      checked={getCheckedStatus(node)}
    />
  ));

  console.log(renderedTreeNodes);

  // >>>>> render
  const needVirtualScroll = treeTotalHeight > visibleHeight ? true : false;

  const tree = (
    <div
      ref={ref}
      className={treeClassName}
      style={{
        ...style,
        width: "100%",
        height: visibleHeight,
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
              ? { overflowY: "scroll", height: visibleHeight }
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
                      height: visibleHeight,
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
