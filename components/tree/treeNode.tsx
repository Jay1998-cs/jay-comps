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

export type TreeNodeKey = string | number;
export type TreeNodeKeys = TreeNodeKey[];
export type CheckedStatus = "none" | "checked" | "indeterminate";

export interface DataNode {
  key: TreeNodeKey;
  title?: TreeNodeTitle;
  className?: string;
  children?: DataNode[];
  isChecked?: boolean;
  isExpanded?: boolean;
  pos?: string;

  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  selectable?: boolean;
  switcherIcon?: IconType;
  style?: React.CSSProperties;

  parentKeys?: TreeNodeKeys;
  parentTitles?: TreeNodeTitle[];
  childKeys?: TreeNodeKeys;
}

export interface TreeNodeAttrubute {
  prefixCls?: string;
  className: string;
  title: React.ReactNode;
  expanded: boolean;
  selected: boolean;
  checked: CheckedStatus;
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
  key: TreeNodeKey; // 必需
  prefixCls?: string;
  className?: string;
  title?: React.ReactNode;
  expanded?: boolean;
  selected?: boolean;
  checked?: CheckedStatus;
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

  onChecked?: (isChecked: boolean, dataNode: DataNode, e?: MouseEvent) => void;
  onExpaned?: (isExpanded: boolean, dataNode: DataNode, e?: MouseEvent) => void;
};

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
    expanded = false,
    checked = "none",
    onChecked,
    onExpaned,
    // checkable = true,
    // disabled = false,
    // disableCheckbox = false,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("tree-treenode", customizePrefixCls);

  // >>>>> state
  const [isExpanded, setIsExpanded] = useState<boolean>(!!expanded);
  if (expanded !== isExpanded) {
    setIsExpanded(expanded); // 响应expanded状态更新
  }
  // console.log(isExpanded);

  const [checkedState, setCheckedState] = useState<CheckedStatus>(checked);
  if (checked !== checkedState) {
    setCheckedState(checked); // 响应checked状态更新
  }

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

  // >>>>> switcher, toggle expanded status
  const handleSwitcherClick: MouseEventHandler = (e) => {
    const nextExpandedState = !isExpanded; // 切换状态：展开 <-> 收起
    setIsExpanded(nextExpandedState);

    if (typeof onExpaned === "function") {
      onExpaned(nextExpandedState, data, e);
    }
  };

  const switcher = isNotLeaf ? (
    <span
      className={classNames(`${prefixCls}-switcher`, {
        [`${prefixCls}-switcher-open`]: isExpanded === true,
        [`${prefixCls}-switcher-close`]: isExpanded === false,
      })}
      onClick={handleSwitcherClick}
    >
      <CaretDownOutlined className={`${prefixCls}-switcher-icon`} />
    </span>
  ) : (
    <span className={`${prefixCls}-switcher ${prefixCls}-switcher-hidden`} />
  );

  // >>>>> checkbox，toggle checked state
  const handleCheckboxClick: MouseEventHandler = (e) => {
    const nextIsChecked: boolean = checkedState === "checked" ? false : true;

    setCheckedState((preChecked) => {
      if (preChecked === "checked") {
        return "none";
      }
      return "checked"; // "none"或"indeterminate"状态时单击checkbox，表示勾选
    });

    if (typeof onChecked === "function") {
      onChecked(nextIsChecked, data, e);
    }
  };

  const checkbox = (
    <span
      className={classNames(`${prefixCls}-checkbox`, {
        [`${prefixCls}-checkbox-checked`]: checkedState === "checked",
        [`${prefixCls}-checkbox-indeterminate`]:
          checkedState === "indeterminate",
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
