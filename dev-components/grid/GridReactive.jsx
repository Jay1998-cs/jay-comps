import React from "react";

import { Grid } from "../../components";
import { useBreakpoint } from "../../components/grid";

const { Row, Col } = Grid;

const Container = ({ children }) => {
  const style = {
    border: "1px solid #000",
    padding: "10px",
    height: "200px",
    margin: "20px",
    resize: "horizontal",
    overflow: "auto",
  };
  return <div style={style}>{children}</div>;
};

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

const demo1 = (
  <Row gutter={[10, 10]}>
    {new Array(10).fill(0).map((_, index) => {
      const key = `col-${index}`;
      return (
        <Col
          key={key}
          xs={{ flex: "100%" }}
          sm={{ flex: "50%" }}
          md={{ flex: "40%" }}
          lg={{ flex: "20%" }}
          xl={{ flex: "10%" }}
        >
          <Box>col</Box>
        </Col>
      );
    })}
  </Row>
);

const demo2 = (
  <Row>
    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
      Col1
    </Col>
    <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>
      Col2
    </Col>
    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
      Col3
    </Col>
  </Row>
);

const demo3 = (
  <Row>
    <Col xs={2} sm={4} md={6} lg={8} xl={10}>
      Col
    </Col>
    <Col xs={20} sm={16} md={12} lg={8} xl={4}>
      Col
    </Col>
    <Col xs={2} sm={4} md={6} lg={8} xl={10}>
      Col
    </Col>
  </Row>
);

const GridReactive = () => {
  const screens = useBreakpoint();

  return (
    <div className="dev-grid-reactive">
      <h2>Reactive: @media screen</h2>
      {demo1}

      <h2>Breakpoint</h2>
      <div>
        current break point:
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
