import React, {
  MouseEvent,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import TreeNode, { DataNode, IconType, Key } from "./treeNode";
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

export const VIRTUAL_HEIGHT = 100; // 可见区域的上下缓冲区高度
export const TREE_NODE_HEIGHT = 28; // 24px(height) + 4px(padding-bottom)

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

  const [expandedKeys, setExpandedKeys] = useState(
    new Set([...defaultExpandedKeys])
  );
  const [checkedKeys, setCheckedKeys] = useState(
    new Set([...defaultCheckedKeys])
  );

  // >>>>> process treeData
  const { treeList, treeMap } = useMemo(() => {
    console.warn("treeData changed");
    return resolveTreeDataToList(treeData);
  }, [treeData]);

  // >>>>> event handler
  const onTreeNodeChecked = (
    checkedKey: Key,
    isChecked: boolean,
    data: DataNode
  ) => {
    if (isChecked) {
      checkedKeys.add(checkedKey);
    } else {
      checkedKeys.delete(checkedKey);
    }
    console.log(checkedKeys);
  };

  const handleTreeScroll = () => {
    const scrollTopVal = Number(scrollRef?.current?.scrollTop) || 0;
    setScrollTop(scrollTopVal);
    console.log("触发滚动更新 scrollTopVal", scrollTopVal);
  };

  // >>>>> treeNodes
  const { renderedTreeNodes, treeTotalHeight, translateY } =
    getVisibleTreeRange(
      treeList,
      visibleHeight,
      TREE_NODE_HEIGHT,
      scrollTop,
      expandedKeys
    );

  console.log("\n=============================\n");
  console.log("translateY: ", translateY);
  // console.log("renderedTreeNodes: ", renderedTreeNodes);

  const treeNodesShown = renderedTreeNodes.map((node) => (
    <TreeNode
      key={node.key}
      data={node}
      indentUnitSize={indentUnitSize}
      onChecked={onTreeNodeChecked}
    />
  ));

  // >>>>> className
  const treeClassName = classNames(prefixCls, className, hashId, cssVarCls);

  // >>>>> render
  const tree = (
    <div
      ref={ref}
      className={treeClassName}
      style={{ ...style, height: visibleHeight }}
    >
      <div
        style={{
          height: treeTotalHeight,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            transform: `translateY(${translateY}px)`,
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
          }}
        >
          <div
            ref={scrollRef}
            className={`${prefixCls}-wrapper`}
            style={{
              height: visibleHeight,
              minHeight: visibleHeight,
              maxHeight: visibleHeight,
            }}
            onScroll={debounce(300, handleTreeScroll)}
            onWheel={() => {
              console.log("111111111111");
            }}
          >
            {treeNodesShown}
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
