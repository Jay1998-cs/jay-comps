import React, { useState } from "react";

import DefinedButtonPage from "./defined-button";
import CustomButtonPage from "./custom-button";

const pagesData = [
  ["defined", DefinedButtonPage],
  ["custom", CustomButtonPage],
];

const choosePage = (pageKey) => {
  let page;
  if (pageKey) {
    const [key, Page] = pagesData.find((page) => page[0] === pageKey);
    if (key && Page) {
      page = <Page />;
    }
  } else {
    page = <DefinedButtonPage />;
  }
  return page;
};

const ButtonPages = (props) => {
  const { pageKey } = props;

  const [page, setPage] = useState(choosePage(pageKey));

  let pageHead = null;

  const selectPage = (e) => {
    const keyStr = e?.target?.dataset?.id;
    if (!keyStr) return;
    let page = choosePage(keyStr) || <DefinedButtonPage />;
    setPage(page);
  };

  pageHead = (
    <div>
      <h1>Button</h1>
      <p>@jay-comps</p>
      <ul
        style={{ color: "blue", cursor: "pointer", width: "fit-content" }}
        onClick={selectPage}
      >
        单击切换页面:
        <li data-id="defined">默认(已定义 | 内置)按钮</li>
        <li data-id="custom">客制按钮: 自定义主题</li>
      </ul>
    </div>
  );

  return (
    <div className="jay-button-page">
      {pageHead}
      {page}
    </div>
  );
};

export default ButtonPages;
