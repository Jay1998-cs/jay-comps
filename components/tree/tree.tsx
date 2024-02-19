import React, { forwardRef, useContext } from "react";

import TreeNode, { DataNode, IconType, Key } from "./treeNode";
import classNames from "classnames";
import { ConfigContext } from "../config-provider";
import useStyle from "./style";
import { resolveTreeDataToList } from "./util";

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

  defaultExpandParent?: boolean;
  autoExpandParent?: boolean;
  defaultExpandAll?: boolean;
  expandAction?: ExpandAction;
  defaultExpandedKeys?: Key[];
  expandedKeys?: Key[];
  defaultCheckedKeys?: Key[];
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  defaultSelectedKeys?: Key[];
  selectedKeys?: Key[];

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

const Tree = forwardRef<HTMLDivElement, TreeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    treeData = [],
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("tree", customizePrefixCls);

  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // >>>>> treeData
  const { treeList, treeMap } = resolveTreeDataToList(treeData);

  // >>>>> treeNodes
  const treeNodes = treeList.map((node, idx) => {
    let title;
    if (typeof node.title === "function") {
      title = node.title(node);
    } else {
      title = node.title;
    }

    return <TreeNode key={node.key ?? idx} title={title} />;
  });

  // >>>>> className
  const treeClassName = classNames(prefixCls, className, hashId, cssVarCls);

  // >>>>> render
  const tree = (
    <div ref={ref} className={treeClassName} style={style}>
      {treeNodes}
    </div>
  );

  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(tree);
  }

  return tree;
});

export default Tree;
