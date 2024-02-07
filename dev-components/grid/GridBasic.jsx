import React from "react";

import Row from "../../components/grid/row";
import { genDiffBlocks } from "../dev-util/createUtils";

const containeiStyle = {
  height: "100px",
  padding: "10px",
  border: "1px solid gray",
};

const GridBasic = () => {
  return (
    <div style={containeiStyle}>
      <Row
        gutter={[10, 20]}
        align={"top"}
        justify={"start"}
        style={{ height: "100%" }}
      >
        {genDiffBlocks(4)}
      </Row>
    </div>
  );
};

export default GridBasic;
