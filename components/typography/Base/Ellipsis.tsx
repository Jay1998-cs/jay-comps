import React, { useMemo, useRef, useState } from "react";
import toArray from "rc-util/lib/Children/toArray";
import useIsomorphicLayoutEffect from "rc-util/lib/hooks/useLayoutEffect";

export interface Ellipsisprops {
  enabledMeasure?: boolean;
  text?: React.ReactNode;
  width: number;
  fontSize: number;
  rows: number;
  children: (
    cutChildren: React.ReactNode[],
    needEllipsis: boolean
  ) => React.ReactNode;
  onEllipsis: (isEllipsis: boolean) => void;
}

// 判断node是否可切割(string或number类型)
function cuttable(node: React.ReactElement) {
  const typeNode = typeof node;
  return typeNode === "string" || typeNode === "number";
}

// 计算nodeList的可切割长度，string或number的单个字符长度为1，节点的长度为1
function getNodesLen(nodeList: React.ReactElement[]) {
  let totalLen = 0;

  nodeList.forEach((node) => {
    if (cuttable(node)) {
      totalLen += String(node).length;
    } else {
      totalLen += 1;
    }
  });

  return totalLen;
}

// 切割nodeList，返回[0, len]下标对应的元素数组
function sliceNodes(nodeList: React.ReactElement[], len: number) {
  let currLen = 0;
  const currentNodeList: React.ReactNode[] = [];

  // 从nodeList中切割出 [0, len] 的部分
  for (let i = 0; i < nodeList.length; ++i) {
    if (currLen === len) {
      return currentNodeList;
    }

    // 计算当前节点的长度
    const node = nodeList[i];
    const canCut = cuttable(node);
    const nodeLen = canCut ? String(node).length : 1;
    const nextLen = currLen + nodeLen;

    // 超出len，去除溢出部分
    if (nextLen > len) {
      const restLen = len - currLen;
      currentNodeList.push(String(node).slice(0, restLen));
      return currentNodeList;
    }

    currentNodeList.push(node);
    currLen = nextLen;
  }

  return currentNodeList;
}

// 状态
const NONE = 0;
const PREPARE = 1;
const WALKING = 2;
const DONE_WITH_ELLIPSIS = 3;
const DONE_WITHOUT_ELLIPSIS = 4;

type WalkingState =
  | typeof NONE
  | typeof PREPARE
  | typeof WALKING
  | typeof DONE_WITH_ELLIPSIS
  | typeof DONE_WITHOUT_ELLIPSIS;

///////////////////////// Ellipsis /////////////////////////
const Ellipsis: React.FC<Ellipsisprops> = ({
  enabledMeasure,
  text,
  width,
  fontSize,
  rows,
  children,
  onEllipsis,
}) => {
  const [[startLen, midLen, endLen], setCutLength] = useState([0, 0, 0]);
  const [lastLen, setLastLen] = useState(0);
  const [walkingState, setWalkingState] = useState<WalkingState>(NONE);

  const [singleRowHeight, setSingleRowHeight] = useState(0);

  const singleRowRef = useRef<HTMLElement>(null);
  const midRowRef = useRef<HTMLElement>(null);

  const nodeList = useMemo(() => toArray(text), [text]);
  const totalLen = useMemo(() => getNodesLen(nodeList), [nodeList]);

  const mergedChildren = useMemo(() => {
    if (!enabledMeasure || walkingState !== DONE_WITH_ELLIPSIS) {
      // 如果存在lastLen，则使用它作为width，避免太多text压缩space
      if (lastLen && walkingState !== DONE_WITHOUT_ELLIPSIS && enabledMeasure) {
        return children(sliceNodes(nodeList, lastLen), lastLen < totalLen);
      }

      return children(nodeList, false);
    }

    return children(sliceNodes(nodeList, midLen), midLen < totalLen);
  }, [children, enabledMeasure, nodeList, midLen, totalLen, walkingState]);

  // ======================== Walk ========================
  useIsomorphicLayoutEffect(() => {
    if (enabledMeasure && width && fontSize && totalLen) {
      setWalkingState(PREPARE); // 触发PREPARE状态
      setCutLength([0, Math.ceil(totalLen / 2), totalLen]);
    }
  }, [enabledMeasure, width, fontSize, totalLen, rows]); // rows ?

  useIsomorphicLayoutEffect(() => {
    if (walkingState === PREPARE) {
      setSingleRowHeight(singleRowRef.current?.offsetHeight || 0); // 行高
    }
  }, [walkingState]);

  useIsomorphicLayoutEffect(() => {
    if (singleRowHeight) {
      if (walkingState === PREPARE) {
        const midHeight = midRowRef.current?.offsetHeight || 0;
        const maxHeight = rows * singleRowHeight;

        if (midHeight <= maxHeight) {
          setWalkingState(DONE_WITHOUT_ELLIPSIS); // 触发无需省略WITHOUT_ELLIPSIS状态
          onEllipsis(false); // 如果空间(高度)足够，则无需省略
        } else {
          setWalkingState(WALKING); // 高度不足，触发WALKING状态
        }
      } else if (walkingState === WALKING) {
        if (startLen !== endLen) {
          const midHeight = midRowRef.current?.offsetHeight || 0;
          const maxHeight = rows * singleRowHeight;

          let nextStartLen = startLen;
          let nextEndlen = endLen;

          if (startLen === endLen - 1) {
            nextEndlen = startLen;
          } else if (midHeight <= maxHeight) {
            nextStartLen = midLen;
          } else {
            nextEndlen = midLen;
          }

          const nextMidLen = Math.ceil((nextStartLen + nextEndlen) / 2);

          setCutLength([nextStartLen, nextMidLen, nextEndlen]);
        } else {
          setWalkingState(DONE_WITH_ELLIPSIS); // 触发省略ELLIPSIS状态
          setLastLen(midLen);
          onEllipsis(true);
        }
      }
    }
  }, [walkingState, startLen, endLen, rows, singleRowHeight]);

  // ======================= Render =======================
  const measureStyle: React.CSSProperties = {
    width,
    whiteSpace: "normal",
    margin: 0,
    padding: 0,
  };

  const renderMeasure = (
    content: React.ReactNode,
    ref: React.Ref<HTMLElement>,
    style: React.CSSProperties
  ) => (
    <span
      aria-hidden
      ref={ref}
      style={{
        position: "fixed",
        display: "block",
        left: 0,
        top: 0,
        zIndex: -9999,
        visibility: "hidden",
        pointerEvents: "none",
        fontSize: Math.ceil(fontSize / 2) * 2,
        ...style,
      }}
    >
      {content}
    </span>
  );

  const renderMeasureSlice = (len: number, ref: React.Ref<HTMLElement>) => {
    const sliceNodeList = sliceNodes(nodeList, len);

    return renderMeasure(children(sliceNodeList, true), ref, measureStyle);
  };

  return (
    <>
      {mergedChildren}
      {enabledMeasure &&
        walkingState !== DONE_WITH_ELLIPSIS &&
        walkingState !== DONE_WITHOUT_ELLIPSIS && (
          <>
            {renderMeasure("lg", singleRowRef, {
              wordBreak: "keep-all",
              whiteSpace: "nowrap",
            })}
            {walkingState === PREPARE
              ? renderMeasure(
                  children(nodeList, false),
                  midRowRef,
                  measureStyle
                )
              : renderMeasureSlice(midLen, midRowRef)}
          </>
        )}
    </>
  );
};

export default Ellipsis;
