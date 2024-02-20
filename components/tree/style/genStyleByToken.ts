import { TreeToken } from ".";
import { resetComponentStyle } from "../../style";

// >>>>>>
export const genTreeStyle = (
  token: TreeToken
): Record<string, React.CSSProperties> => {
  const { componentCls: cls } = token;

  return {
    [cls]: {
      ...resetComponentStyle(token),
      overflow: "hidden",
    },

    [`${cls} [class^=${cls.slice(1)}]`]: {
      boxSizing: "border-box",
    },

    // tree wrapper
    [`${cls} ${cls}-wrapper`]: {
      overflowY: "scroll",
    },
  };
};

// >>>>>
export const genTreeNodeStyle = (
  token: TreeToken
): Record<string, React.CSSProperties> => {
  const {
    componentCls: cls,
    nodeHeight = "24px",
    nodeHoverBg,
    nodeSelectedBg,
  } = token;

  const treeNodeSlt = `${cls} ${cls}-treenode`;
  const treeNodeCls = `${cls}-treenode`;

  return {
    [treeNodeSlt]: {
      display: "flex",
      alignItems: "flex-start",
      padding: "0 0 4px 0",
      outline: "none",
    },

    [`${treeNodeSlt} ${treeNodeCls}-content-wrapper`]: {
      position: "relative",
      zIndex: "auto",
      minHeight: nodeHeight,
      margin: "0",
      padding: "0 4px",
      lineHeight: nodeHeight,
      background: "transparent",
      borderRadius: token.borderRadius || "6px",
      cursor: "pointer",
    },

    [`${treeNodeSlt} ${treeNodeCls}-content-wrapper:hover`]: {
      backgroundColor: nodeHoverBg || "#fff",
    },

    // selected xxxxxxxxxxxxxxxxxxx 待改动
    [`${treeNodeSlt} ${treeNodeSlt}-selected`]: {
      backgroundColor: nodeSelectedBg || "#1677ff",
    },

    // indent
    [`${treeNodeSlt} ${treeNodeCls}-indent`]: {
      display: "inline-block",
      width: "0",
      height: nodeHeight,
      alignSelf: "stretch",
      whiteSpace: "nowrap",
      userSelect: "none",
      pointerEvents: "none",
    },

    // switcher
    [`${treeNodeSlt} ${treeNodeCls}-switcher`]: {
      position: "relative",
      flex: "none",
      alignSelf: "stretch",
      width: "24px",
      margin: "0",
      lineHeight: nodeHeight,
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: token.borderRadius || "6px",
      transition: "all 0.2s",
    },

    [`${treeNodeSlt} ${treeNodeCls}-switcher:hover`]: {
      backgroundColor: nodeHoverBg || "#fff",
    },

    [`${treeNodeSlt} ${treeNodeCls}-switcher ${treeNodeCls}-switcher-icon`]: {
      fontSize: "10px",
      display: "inline-block",
      verticalAlign: "baseline",
      transition: "transform 0.2s",
    },

    [`${treeNodeSlt} ${treeNodeCls}-switcher-close ${treeNodeCls}-switcher-icon`]:
      {
        transform: "rotate(-90deg)",
      },

    // checkbox
    [`${treeNodeSlt} ${treeNodeCls}-checkbox`]: {
      position: "relative",
      margin: "0",
      padding: "0",
      color: "rgba(0,0,0,0.88)",
      whiteSpace: "nowrap",
      alignSelf: "flex-start",
      width: "24px",
      height: nodeHeight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox ${treeNodeCls}-checkbox-inner`]: {
      cursor: "pointer",
      width: "16px",
      height: "16px",
      backgroundColor: "#fff",
      border: "1px solid #d9d9d9",
      borderRadius: "4px",
      borderCollapse: "separate",
      transition: "all 0.2s",
    },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox ${treeNodeCls}-checkbox-inner::after`]:
      {
        position: "absolute",
        content: "''",
        opacity: "1",
        top: "50%",
        insetInlineStart: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        boxSizing: "border-box",
        border: "0",
        width: "16px",
        height: "16px",
        borderRadius: "0",
      },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox-indeterminate ${treeNodeCls}-checkbox-inner::after`]:
      {
        width: "8px",
        height: "8px",
        backgroundColor: token.colorPrimary || "#1677ff",
      },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox-indeterminate ${treeNodeCls}-checkbox-inner:hover`]:
      {
        borderColor: token.colorPrimary || "#1677ff",
      },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox-checked ${treeNodeCls}-checkbox-inner`]:
      {
        backgroundColor: token.colorPrimary || "#1677ff",
        borderColor: token.colorPrimary || "#1677ff",
      },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox-checked ${treeNodeCls}-checkbox-inner::after`]:
      {
        width: "5px",
        height: "8px",
        border: "2px solid #fff",
        insetInlineStart: "35%",
        borderTop: "0",
        borderLeft: "0",
        transform: "rotate(45deg) translate(-50%, -50%) scale(1)",
        transition: "all 0.2s",
        transformOrigin: "center",
      },

    [`${treeNodeSlt} ${treeNodeCls}-checkbox-checked ${treeNodeCls}-checkbox-inner:hover`]:
      {
        opacity: "0.8",
      },
  };
};
