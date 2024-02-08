import React, { useState } from "react";

import Row from "../../components/grid/row";
import Col from "../../components/grid/col";

import { genButtons } from "../dev-util/createUtils";
import Flex from "../../components/flex"; // 若缺失的化，可自定义Flex组件

const alignVals = ["top", "middle", "bottom"];

const justifyVals = [
  "start",
  "end",
  "center",
  "space-around",
  "space-between",
  "space-evenly",
];

const Box = ({ children, t }) => (
  <div
    style={{
      height: "30px",
      padding: "5px",
      lineHeight: "30px",
      background: "#0092ff",
      borderRadius: " 4px",
      textAlign: "center",
      fontSize: "14px",
    }}
  >
    {t ? "column" : null}
    {children}
  </div>
);

const wrappStyle = {
  width: "60%",
  height: "200px",
  padding: "10px",
  border: "1px solid gray",
};

const Input = ({ children, text, updateFn, initValue, ...rest }) => {
  return (
    <div>
      <span>{text}</span>
      <input
        type="number"
        defaultValue={initValue || 10}
        min={0}
        max={100}
        onFocus={updateFn}
        onChange={updateFn}
        {...rest}
      />
    </div>
  );
};

// >>>>>> GridAlignJustify
const GridAlignJustify = () => {
  const [align, setAlign] = useState("top");
  const [justify, setJustify] = useState("start");

  return (
    <Flex vertical gap={"small"}>
      <Flex gap={"small"}>align: {genButtons(alignVals, setAlign)}</Flex>
      <Flex gap={"small"}>justify: {genButtons(justifyVals, setJustify)}</Flex>

      <div className="dev-row-container" style={wrappStyle}>
        <Row
          align={align}
          justify={justify}
          style={{ height: "100%" }}
          gutter={10}
        >
          <Col>
            <Box t />
          </Col>
          <Col>
            <Box t />
          </Col>
          <Col>
            <Box t />
          </Col>
          <Col>
            <Box t />
          </Col>
        </Row>
      </div>
    </Flex>
  );
};

// >>>>> GridGutter
const GridGutter = () => {
  const [colCount, setColCount] = useState(12);
  const [gutterH, setGutterH] = useState(10);
  const [gutterV, setGutterV] = useState(10);

  const updateGutterH = (e) => {
    setGutterH(Number(e?.target.value || 0));
  };
  const updateGutterV = (e) => {
    setGutterV(Number(e?.target.value || 0));
  };
  const updateSpan = (e) => {
    setColCount(Number(e?.target.value || 2));
  };

  return (
    <Flex vertical gap={"small"}>
      <Input text="span(共24栅格): " updateFn={updateSpan} initValue={12} />
      <Input text="horizontal gutter(col gap): " updateFn={updateGutterH} />
      <Input text="vertical gutter(row gap): " updateFn={updateGutterV} />
      <div className="dev-row-container" style={{ ...wrappStyle, height: 300 }}>
        <Row gutter={[gutterH, gutterV]}>
          <Col span={colCount}>
            <Box />
          </Col>
          <Col span={colCount}>
            <Box />
          </Col>
          <Col span={colCount}>
            <Box />
          </Col>

          <Col span={colCount}>
            <Box />
          </Col>
          <Col span={colCount}>
            <Box />
          </Col>
          <Col span={colCount}>
            <Box />
          </Col>
        </Row>
      </div>
    </Flex>
  );
};

// >>>>> GridOrder
const GridOrder = () => {
  return (
    <Flex vertical gap={10}>
      <div>通过order属性定义column的排列顺序:</div>
      <Row gutter={20}>
        <Col span={6} order={4}>
          <Box>col1</Box>
        </Col>
        <Col span={6} order={3}>
          <Box>col2</Box>
        </Col>
        <Col span={6} order={2}>
          <Box>col3</Box>
        </Col>
        <Col span={6} order={1}>
          <Box>col4</Box>
        </Col>
      </Row>
    </Flex>
  );
};

// >>>>> GridOffset
const GridOffset = () => {
  return (
    <Flex vertical gap={10}>
      <Row>
        <Col span={8}>
          <Box>col1-span8</Box>
        </Col>
        <Col span={8} offset={8}>
          <Box>col2-span8-offset8</Box>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Box>col-span12-offset6</Box>
        </Col>
      </Row>
    </Flex>
  );
};

// >>>>> GridPushPull
const GridPushPull = () => {
  return (
    <Flex vertical gap={20}>
      <Row>
        <Col span={4} push={6}>
          <Box>col-span4-push6</Box>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={18} push={6}>
          <Box>col1-span18-push6</Box>
        </Col>
        <Col span={6} pull={18}>
          <Box>col2-span6-pull18</Box>
        </Col>
      </Row>
    </Flex>
  );
};

// >>>>> export Page GridBasic
const GridBasic = () => {
  return (
    <div className="dev-grid-basic">
      <h2>Align & Justify</h2>
      <GridAlignJustify />

      <h2>Gutter</h2>
      <GridGutter />

      <h2>Order</h2>
      <GridOrder />

      <h2>Offset</h2>
      <GridOffset />

      <h2>Push & Pull</h2>
      <GridPushPull />
    </div>
  );
};

export default GridBasic;
