import React, { useState } from "react";

import { Flex } from "../../components";

const Block = ({ color }) => {
  return (
    <div
      style={{
        height: "40px",
        width: "100px",
        background: color || "#1677ff",
      }}
    ></div>
  );
};

const genDiffBlocks = (
  number = 0,
  colorOdd = "#1677ff",
  colorEven = "rgb(20,190,20)"
) => {
  const blockList = [];
  for (let i = 1; i <= number; ++i) {
    let color = i % 2 === 0 ? colorEven : colorOdd;
    blockList.push(<Block key={i} color={color} />);
  }

  return blockList;
};

const createButtons = (list = [""], setState) => {
  const nodeList = [];
  list.forEach((val) => {
    nodeList.push(
      <button
        key={val}
        onClick={() => {
          setState(val);
        }}
      >
        {val}
      </button>
    );
  });
  return nodeList;
};

const style = {
  width: "600px",
  height: "200px",
  border: "1px solid gray",
  padding: "10px",
};

// 基本使用
const FlexBasic = () => {
  const [direction, setDirection] = React.useState("row");
  const [gap, setGap] = React.useState(0);

  const DirectionButtons = (
    <Flex gap={"small"}>{createButtons(["row", "column"], setDirection)}</Flex>
  );

  const GapButtons = (
    <Flex gap={"small"}>
      {createButtons(["small", "middle", "large"], setGap)}
      <div>
        <label style={{ fontSize: "12px" }}>self defined: </label>
        <input
          type="number"
          defaultValue={0}
          style={{ width: "50px" }}
          min={0}
          max={400}
          onChange={(e) => {
            setGap(`${e.target.value}px`);
          }}
          onFocus={(e) => {
            setGap(`${e.target.value}px`);
          }}
        />
      </div>
    </Flex>
  );

  return (
    <Flex vertical gap={"middle"}>
      <span>flex-direction: </span>
      {DirectionButtons}
      <span>gap: </span>
      {GapButtons}
      <Flex gap={gap} vertical={direction === "column"}>
        {genDiffBlocks(4)}
      </Flex>
    </Flex>
  );
};

// 对齐方式
const FlexJustifyAlign = () => {
  const [justify, setJustify] = useState("normal");
  const [align, setAlign] = useState("normal");

  const justifyOpts = [
    "flex-start",
    "center",
    "flex-end",
    "space-between",
    "space-around",
    "space-evenly",
  ];
  const alignOpts = ["flex-start", "center", "flex-end"];

  return (
    <Flex vertical gap={"middle"}>
      <span>justify-content:</span>
      <Flex gap={"small"}>{createButtons(justifyOpts, setJustify)}</Flex>
      <span>align-items:</span>
      <Flex gap={"small"}>{createButtons(alignOpts, setAlign)}</Flex>

      <Flex gap={"small"} justify={justify} align={align} style={style}>
        {genDiffBlocks(4)}
      </Flex>
    </Flex>
  );
};

// 自动换行
const FlexWrap = () => {
  const [wrap, setWrap] = useState("wrap");
  const wrapVals = ["wrap", "no-wrap", "wrap-reverse"];

  return (
    <Flex vertical gap={"small"}>
      <Flex gap={"small"}>{createButtons(wrapVals, setWrap)}</Flex>
      <Flex style={style} wrap={wrap} gap={"small"}>
        {genDiffBlocks(12)}
      </Flex>
    </Flex>
  );
};

// flex属性
const FlexAttribute = () => {
  return (
    <Flex vertical gap={"small"}>
      <ul>
        <li>注意, flex是"flex项目(元素)"属性，而不是"flex容器"</li>
        <li>
          flex为三个属性的简写 <b>flex: flex-grow, flex-shrink, flex-basis</b>
        </li>
        <li>
          有三个关键字值, flex: initial(默认, 具体值为0 1 auto) | auto(即1 1
          auto) | none(即0 0 auto)
        </li>
        <li>参考: https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex</li>
      </ul>
    </Flex>
  );
};

const FlexPage = () => {
  return (
    <div className="dev-flex-page">
      <h1>弹性布局Flex</h1>
      <h2>基本使用</h2>
      <FlexBasic />

      <h2>对齐方式</h2>
      <FlexJustifyAlign />

      <h2>换行方式(flex-wrap)</h2>
      <FlexWrap />

      <h2>注意: flex属性</h2>
      <FlexAttribute />
    </div>
  );
};

export default FlexPage;
