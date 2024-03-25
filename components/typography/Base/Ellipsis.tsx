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
const NONE = 0; // 未开始处理
const PREPARE = 1; // 准备开始处理
const WALKING = 2; // 正在处理
const DONE_WITH_ELLIPSIS = 3; // 处理完毕，需要省略溢出文本
const DONE_WITHOUT_ELLIPSIS = 4; // 处理完毕，无需省略

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
  width, // 父容器宽度
  fontSize,
  rows,
  children,
  onEllipsis,
}) => {
  const [[startIdx, renderedLen, endIdx], setCutLength] = useState([0, 0, 0]);
  const [lastLen, setLastLen] = useState(0);
  const [walkingState, setWalkingState] = useState<WalkingState>(NONE);

  const [singleRowHeight, setSingleRowHeight] = useState(0);

  const singleRowRef = useRef<HTMLElement>(null); // 将text存储在一行中(span)，计算单行高度
  const mockParentRef = useRef<HTMLElement>(null); // 将text存储在与父容器同宽(width)的span中，筛选待渲染的text

  const nodeList = useMemo(() => toArray(text), [text]);
  const totalLen = useMemo(() => getNodesLen(nodeList), [nodeList]);

  // 组件最终渲染的内容
  const mergedChildren = useMemo(() => {
    // 1. 无需省略的情况，渲染原节点
    if (!enabledMeasure || walkingState !== DONE_WITH_ELLIPSIS) {
      // 如果存在lastLen，则使用它作为width，避免太多text压缩space
      if (lastLen && walkingState !== DONE_WITHOUT_ELLIPSIS && enabledMeasure) {
        return children(sliceNodes(nodeList, lastLen), lastLen < totalLen);
      }
      // 不存在lastLen，渲染原文本节点
      return children(nodeList, false);
    }

    // 2. 省略溢出文本，只渲染[0, renderedLen]部分
    return children(sliceNodes(nodeList, renderedLen), renderedLen < totalLen);
  }, [
    children,
    enabledMeasure,
    nodeList,
    renderedLen,
    totalLen,
    walkingState,
    lastLen,
  ]);

  // ======================== Walk ========================
  // >>>>> NONE：监听是否需要开启文本溢出省略效果 NONE-> PREPARE
  useIsomorphicLayoutEffect(() => {
    if (enabledMeasure && width && fontSize && totalLen) {
      setWalkingState(PREPARE); // 需要省略，触发PREPARE状态，准备开始处理
      setCutLength([0, Math.ceil(totalLen / 2), totalLen]); // 文本三个位置的长度[0, mid, end]
    }
  }, [enabledMeasure, width, fontSize, totalLen, rows]); // 注意: rows变化时需要重新计算

  // >>>>> PREPARE：进行一些准备或预处理，即获取单行文本的高度(singleRowHeight)
  useIsomorphicLayoutEffect(() => {
    if (walkingState === PREPARE) {
      setSingleRowHeight(singleRowRef.current?.offsetHeight || 0); // 行高
    }
  }, [walkingState]);

  // >>>>> Find：搜索目标长度renderedLen，找到渲染内容 text[0, renderedLen] 的高度等于(或近似)父容器高
  useIsomorphicLayoutEffect(() => {
    if (singleRowHeight) {
      if (walkingState === PREPARE) {
        // 【PREPARE】
        const maxHeight = rows * singleRowHeight; // 可展示的文本的总高度
        const currentHeight = mockParentRef.current?.offsetHeight || 0; // 当前待渲染内容的高度

        if (currentHeight <= maxHeight) {
          // 高度足够，无需省略，触发 DONE_WITHOUT_ELLIPSIS 状态
          setWalkingState(DONE_WITHOUT_ELLIPSIS);
          onEllipsis(false);
        } else {
          // 高度不足，需要省略，进入 WALKING 状态
          setWalkingState(WALKING);
        }
      } else if (walkingState === WALKING) {
        // 【WALKING】文本溢出，搜索目标长度renderedLen，满足渲染内容的高度等于父容器高度rows*singleRowHeight
        if (startIdx !== endIdx) {
          const currentHeight = mockParentRef.current?.offsetHeight || 0;
          const maxHeight = rows * singleRowHeight;

          let nextStartIdx = startIdx;
          let nextEndIdx = endIdx;

          // 二分查找算法，减少mockParentRef.current(待渲染的内容的容器,与实际容器尺寸相同)的高度
          // 大致思路（实现上有点偏差）：
          // （1）如果 currentHeight > maxHeigh，说明溢出，那么减少一半长度即更新右指针 nextEndIdx = renderedLen
          // （2）如果 currentHeight < maxHeigh，说明不足，那么需要增加渲染文本的长度，即更新左指针 nextStartIdx = renderedLen
          // （3）如果 currentHeight = maxHeigh，则找到待渲染内容即text[0, nextRenderedLen]
          // （4）为防止死循环，当startIdx和endIdx相邻时(差为1)，将nextEndIdx = startIdx，结束搜索(跳出外部if转到else)
          if (startIdx === endIdx - 1) {
            nextEndIdx = startIdx; // 两指针相邻，已经逼近或找到答案，为防止陷入死循环，令二者取值相同跳出外层if
          } else if (currentHeight <= maxHeight) {
            nextStartIdx = renderedLen; // 文本高度不足，增加长度
            // 注：这里取等的原因是，如果此时已经找到目标长度，但仍需更新一次 nextStartIdx 指针，使其与endIdx相等，从而跳出搜索过程
          } else {
            nextEndIdx = renderedLen; // 本文高度溢出，折半缩减
          }
          const nextRenderedLen = Math.ceil((nextStartIdx + nextEndIdx) / 2);
          setCutLength([nextStartIdx, nextRenderedLen, nextEndIdx]); // 【更新状态,重复上述过程】
        } else {
          // 【DONE_】搜索完毕
          setWalkingState(DONE_WITH_ELLIPSIS); // 触发省略ELLIPSIS状态
          setLastLen(renderedLen);
          onEllipsis(true);
        }
      }
    }
  }, [walkingState, startIdx, endIdx, rows, singleRowHeight]);

  // ======================= Element used for measure =======================
  const measureStyle: React.CSSProperties = {
    width,
    whiteSpace: "normal",
    margin: 0,
    padding: 0,
  };

  const createMeasureElem = (
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

  // 存在溢出的情况下，生成一个隐藏元素并绑定ref，用于测量单行文本的高度等信息
  const renderMeasureSlice = (len: number, ref: React.Ref<HTMLElement>) => {
    const sliceNodeList = sliceNodes(nodeList, len);

    return createMeasureElem(children(sliceNodeList, true), ref, measureStyle);
  };

  // ======================= render Ellipsis =======================
  return (
    <>
      {mergedChildren}

      {enabledMeasure &&
        walkingState !== DONE_WITH_ELLIPSIS &&
        walkingState !== DONE_WITHOUT_ELLIPSIS && (
          <>
            {createMeasureElem("lg", singleRowRef, {
              wordBreak: "keep-all",
              whiteSpace: "nowrap",
            })}

            {walkingState === PREPARE
              ? createMeasureElem(
                  children(nodeList, false),
                  mockParentRef,
                  measureStyle
                )
              : renderMeasureSlice(renderedLen, mockParentRef)}
          </>
        )}
    </>
  );
};

export default Ellipsis;
