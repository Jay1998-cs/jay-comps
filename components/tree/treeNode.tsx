import classNames from "classnames";
import React, {
  MouseEvent,
  MouseEventHandler,
  forwardRef,
  useContext,
  useState,
} from "react";
import { CaretDownOutlined } from "@ant-design/icons";

import { ConfigContext } from "../config-provider";

export type Key = string | number;

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
  childKeys?: Key[];
}

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

export type TreeNodeProps = {
  key: Key; // 必需
  prefixCls?: string;
  className?: string;
  title?: React.ReactNode;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
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

  indentUnitSize?: number;
  data?: DataNode;

  onChecked?: (
    checkedKey: Key,
    isChecked: boolean,
    data: DataNode,
    e?: MouseEvent
  ) => void;
  onExpaned?: MouseEventHandler;
} & DataNode;

export type TreeNodeType = TreeNodeProps;

export type IconType =
  | React.ReactNode
  | ((props: TreeNodeProps) => React.ReactNode);

export type TreeNodeTitle =
  | React.ReactNode
  | ((data: DataNode) => React.ReactNode);

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
    title: customizeTitle,
    data,
    indentUnitSize = 24,
    expanded = true, // xxxxxxxxx 待修改
    checked = false,
    indeterminate = false,
    onChecked,
    // checkable = true,
    // disabled = false,
    // disableCheckbox = false,
    // icon,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("tree-treenode", customizePrefixCls);

  // >>>>> state
  const [isExpanded, setIsExpanded] = useState(!!expanded);
  const [isChecked, setIsChecked] = useState(!!checked);
  const [isCheckedSome, setIsCheckedSome] = useState(false);

  // >>>>> process treenode data
  if (!data) {
    return (
      <div ref={ref} style={style} className={`${prefixCls} ${className}`} />
    );
  }

  let title = customizeTitle;
  if (typeof data.title === "function") {
    title = data.title(data);
  } else if (data.title) {
    title = data.title;
  }

  const isNotLeaf = !!data.children;
  const indentSize = indentUnitSize * (data.parentKeys?.length || 0);

  // >>>>> className
  const treeNodeClassName = classNames(className, prefixCls);

  // >>>>> indentNode
  const indentStyle: React.CSSProperties = { paddingLeft: `${indentSize}px` };
  const indentNode = (
    <span className={`${prefixCls}-indent`} style={indentStyle} />
  );

  // >>>>> switcher
  const handleSwitcherClick: MouseEventHandler = () => {
    setIsExpanded((preExpanded) => !preExpanded);
    // 调用tree传入的回调函数onExpand
  };

  const switcher = isNotLeaf ? (
    <span
      className={classNames(`${prefixCls}-switcher`, {
        [`${prefixCls}-switcher-open`]: expanded === true,
        [`${prefixCls}-switcher-close`]: expanded === false,
      })}
      onClick={handleSwitcherClick}
    >
      <CaretDownOutlined className={`${prefixCls}-switcher-icon`} />
    </span>
  ) : null;

  // >>>>> checkbox
  const handleCheckboxClick: MouseEventHandler = (e) => {
    setIsChecked((preChecked) => !preChecked);

    if (typeof onChecked === "function") {
      onChecked(data.key, !isChecked, data, e);
    }
  };

  const checkbox = (
    <span
      className={classNames(`${prefixCls}-checkbox`, {
        [`${prefixCls}-checkbox-checked`]: isChecked,
        [`${prefixCls}-checkbox-indeterminate`]: isCheckedSome,
      })}
    >
      <span
        className={`${prefixCls}-checkbox-inner`}
        onClick={handleCheckboxClick}
      ></span>
    </span>
  );

  // >>>>> render
  const treeNodeContent = (
    <span className={`${prefixCls}-content-wrapper`}>
      <span className={`${prefixCls}-title`}>{title}</span>
      {children}
    </span>
  );

  return (
    <div ref={ref} className={treeNodeClassName} style={style}>
      {indentNode}
      {switcher}
      {checkbox}
      {treeNodeContent}
    </div>
  );
});

export default TreeNode;
