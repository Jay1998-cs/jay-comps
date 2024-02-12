import React from "react";

import { Grid } from "../../components";
import { useBreakpoint } from "../../components/grid";

const { Row, Col } = Grid;

const Box = ({ children, t, c }) => {
  const bg = c ? "rgb(80,190,120)" : "#0092ff";
  return (
    <div
      style={{
        height: "30px",
        padding: "5px",
        lineHeight: "30px",
        background: bg,
        borderRadius: " 4px",
        textAlign: "center",
        fontSize: "14px",
      }}
    >
      {t ? "column" : null}
      {children}
    </div>
  );
};

// >> 不同屏幕尺寸下，列所占栅格数span(如24, 12, ...)
const demo1 = (
  <Row gutter={[10, 10]}>
    {new Array(12).fill(0).map((_, index) => {
      const key = `col-${index}`;
      return (
        <Col key={key} xs={24} sm={12} md={8} lg={6} xl={4} xxl={2}>
          <Box c>col</Box>
        </Col>
      );
    })}
  </Row>
);

// >> 不同屏幕尺寸下，列的flex取值(如flex:50%)
const demo2 = (
  <Row gutter={[10, 10]}>
    {new Array(4).fill(0).map((_, index) => {
      const key = `col-${index}`;
      return (
        <Col
          key={key}
          xs={{ flex: "50%" }}
          sm={{ flex: "30%" }}
          md={{ flex: "20%" }}
          lg={{ flex: "10%" }}
          xl={{ flex: "5%" }}
        >
          <Box c>col</Box>
        </Col>
      );
    })}
  </Row>
);

// >> 不同屏幕尺寸下，所占栅格数
const demo3 = (
  <Row gutter={[10, 10]}>
    <Col xs={2} sm={4} md={6} lg={8} xl={10} xxl={4}>
      <Box c>col1</Box>
    </Col>
    <Col xs={20} sm={16} md={12} lg={8} xl={4} xxl={16}>
      <Box c>col2</Box>
    </Col>
    <Col xs={2} sm={4} md={6} lg={8} xl={10} xxl={4}>
      <Box c>col3</Box>
    </Col>
  </Row>
);

// >> 不同屏幕尺寸下，所占栅格数 + 偏移量
const demo4 = (
  <Row gutter={[10, 10]}>
    <Col
      xs={{ span: 4 }}
      sm={{ span: 3, offset: 3 }}
      lg={{ span: 6, offset: 2 }}
      xl={{ span: 11, offset: 1 }}
    >
      <Box c>col1</Box>
    </Col>
    <Col
      xs={{ span: 4 }}
      sm={{ span: 8, offset: 3 }}
      lg={{ span: 6, offset: 2 }}
      xl={{ span: 7, offset: 1 }}
    >
      <Box c>col2</Box>
    </Col>
    <Col
      xs={{ span: 4 }}
      sm={{ span: 3, offset: 3 }}
      lg={{ span: 6, offset: 2 }}
      xl={{ span: 3, offset: 1 }}
    >
      <Box c>col3</Box>
    </Col>
  </Row>
);

// >>>>> Reactive grid page
const GridReactive = () => {
  const screens = useBreakpoint();
  const margin = { margin: "10px" };

  return (
    <div className="dev-grid-reactive">
      <h2>Reactive: @media </h2>

      <h3>reactive span</h3>
      <div style={margin}>不同屏幕尺寸下,每列所占栅格数(如24, 12, 8, ...)</div>
      {demo1}

      <h3>reactive flex</h3>
      <div style={margin}>不同屏幕尺寸下,列的flex取值(如50%, 200px, ...)</div>
      {demo2}

      <h3>reactive diff span</h3>
      <div style={margin}>不同屏幕尺寸下,不同列所占不同栅格数</div>
      {demo3}

      <h3>reactive diff span & offset</h3>
      <div style={margin}>不同屏幕尺寸下,列所占不同栅格数和偏移量</div>
      {demo4}

      <h3>Breakpoint</h3>
      <div>
        current break point：
        {Object.entries(screens)
          .filter((screen) => !!screen[1])
          .map((screen) => (
            <b color="blue" key={screen[0]}>
              {screen[0] + " "}
            </b>
          ))}
      </div>
    </div>
  );
};

export default GridReactive;
