import React from "react";

import ButtonPages from "./button";
import TypographyPages from "./typography";
import FlexPage from "./flex";
import GridPage from "./grid";
import SpinPage from "./spin";
import QRCodePage from "./qrcode";
import InputPage from "./input";
import ModalPage from "./modal";
import TreePage from "./tree";
import PaginationPage from "./pagination";

const compsMap = {
  button: {
    name: "按钮(button)",
    page: <ButtonPages pageKey="defined" />,
  },
  input: {
    name: "输入框(input)",
    page: <InputPage />,
  },
  tree: {
    name: "树形控件(tree)",
    page: <TreePage />,
  },
  typography: {
    name: "排版(typography)",
    page: <TypographyPages />,
  },
  grid: {
    name: "栅格布局(grid)",
    page: <GridPage />,
  },
  flex: {
    name: "弹性布局(flex)",
    page: <FlexPage />,
  },
  pagination: {
    name: "页码(pagination)",
    page: <PaginationPage />,
  },
  modal: {
    name: "遮罩|弹窗(modal)",
    page: <ModalPage />,
  },
  spin: {
    name: "加载样式(spin)",
    page: <SpinPage />,
  },

  qrcode: {
    name: "二维码(qrcode)",
    page: <QRCodePage />,
  },
};

const Line = () => {
  return (
    <div
      style={{ margin: "40px 0", borderBottom: "1px dashed lightgray" }}
    ></div>
  );
};

const JcDevApp = () => {
  const [page, setPage] = React.useState(compsMap.button.page);

  const handlePageClick = (page) => {
    setPage(page);
  };

  const getPages = (compsMap = {}) => {
    return Object.values(compsMap).map((item, idx) => {
      return (
        <div
          className="page-option"
          style={{ cursor: "pointer" }}
          key={item.name}
          onClick={() => {
            handlePageClick(item.page);
          }}
        >
          {item.name}
        </div>
      );
    });
  };

  return (
    <div className="root-dev-jay-comps">
      <h1>欢迎来到React组件库: jay-comps</h1>
      <p>(单击下列选项查看组件详情)</p>
      <div
        className="dev-pages-container"
        style={{
          border: "1px solid gray",
          margin: " 10px 0 10px 0",
          padding: "10px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "30px",
          lineHeight: "30px",
          gap: "6px",
          color: "blue",
          maxWidth: "500px",
        }}
      >
        {getPages(compsMap)}
      </div>
      <Line />
      {page}
    </div>
  );
};

export default JcDevApp;
