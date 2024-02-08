import React from "react";

export const Block = ({ color, height, width, style }) => {
  return (
    <div
      style={{
        height: height || "40px",
        width: width || "100px",
        background: color || "#1677ff",
        ...style,
      }}
    ></div>
  );
};

export const genDiffBlocks = (
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

export const genButtons = (list = [""], setState) => {
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
