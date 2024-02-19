import classNames from "classnames";
import React, { LegacyRef, forwardRef, useContext } from "react";
import { ConfigContext } from "../config-provider";

export type Key = string | number;

export interface TreeNodeAttrubute {
  prefixCls?: string;
  className: string;
  title: React.ReactNode;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  isLeaf: boolean;
  selectable: boolean;
  disabled: boolean;
  disableCheckBox: boolean;
  eventKey: string; // ?
  children: React.ReactNode;
  style?: React.CSSProperties;
  pos?: string; // 位置信息，如0_0表示第二层
  // dragOver: boolean;
  // dragOverGapTop: boolean;
  // dragOverGapBottom: boolean;
}

// export interface TreeNodeDragEnterEvent extends TreeNodeMouseEvent {
//   expandedKeys: Key[];
// }
// export interface TreeNodeDropEvent {
//   node: TreeNode;
//   dragNode: TreeNode;
//   dragNodesKeys: Key[];
//   dropPosition: number;
//   dropToGap?: boolean;
//   event: React.MouseEvent<HTMLElement>;
// }

export interface TreeNodeProps {
  key: Key;
  prefixCls?: string;
  className?: string;
  title?: React.ReactNode;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  halfChecked?: boolean;
  isLeaf?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  eventKey?: string;
  loading?: boolean;
  icon?: ((treeNode: TreeNodeAttrubute) => React.ReactNode) | React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode; // remove ？树节点不包裹内容
}

export type TreeNodeType = TreeNodeProps;

export type IconType =
  | React.ReactNode
  | ((props: TreeNodeProps) => React.ReactNode);

export type TreeNodeTitle =
  | React.ReactNode
  | ((data: DataNode) => React.ReactNode);

export interface DataNode {
  key: Key;
  title?: TreeNodeTitle;
  className?: string;
  children?: DataNode[];
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  selectable?: boolean;
  switcherIcon?: IconType;
  style?: React.CSSProperties;
  pos?: string;

  parentKeys?: Key[];
  parentTitles?: TreeNodeTitle[];
  childKeys: Key[];
}

export interface TreeNodeBaseEvent {
  node: TreeNodeProps;
  nativeEvent: MouseEvent;
}

export interface TreeNodeCheckedEvent extends TreeNodeBaseEvent {
  event: "check";
  checked?: boolean;
  checkNodes?: TreeNodeProps[];
}

export interface TreeNodeSelectedEvent extends TreeNodeBaseEvent {
  event: "select";
  checked?: boolean;
  checkNodes?: DataNode[];
}

export interface TreeNodeExpandEvent extends TreeNodeBaseEvent {
  expanded?: boolean;
}

export interface TreeNodeMouseEvent {
  node: TreeNodeProps;
  event: React.DragEvent<HTMLElement>;
}

// ========================= TreeNode =========================
const TreeNode = forwardRef<HTMLDivElement, TreeNodeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    children,
    title,
    expanded,
    selected,
    selectable,
    checked,
    checkable,
    halfChecked,
    disabled,
    disableCheckbox,
    icon,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("tree-treenode", customizePrefixCls);

  // >>>>> className
  const treeNodeClassName = classNames(className, prefixCls);

  // >>>>> indent
  const indent = <span className={`${prefixCls}-indent`}>口</span>;

  // >>>>> switcher
  const switcher = <span className={`${prefixCls}-switcher`}>{">"}</span>;

  // >>>>> checkbox
  const checkbox = <span className={`${prefixCls}-checkbox`}>{"✔"}</span>;

  // >>>>> render
  const treeNodeContent = (
    <span className={`${prefixCls}-content-wrapper`}>
      <span className={`${prefixCls}-title`}>{title}</span>
      {children}
    </span>
  );

  return (
    <div ref={ref} className={treeNodeClassName} style={style}>
      {indent}
      {switcher}
      {checkbox}
      {treeNodeContent}
    </div>
  );
});

export default TreeNode;
