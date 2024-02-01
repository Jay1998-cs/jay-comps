import React from "react";

import DefinedButtonPage from "./defined-button";
import CustomButtonPage from "./custom-button";

const pagesData = [
  ["defined", DefinedButtonPage],
  ["custom", CustomButtonPage],
];

const ButtonPages = (props) => {
  const { pageKey } = props;

  let page = null;

  if (pageKey) {
    const [key, Page] = pagesData.find((page) => page[0] === pageKey);
    if (key && Page) {
      page = <Page />;
    }
    console.warn(Page);
  } else {
    page = <DefinedButtonPage />;
  }

  return page;
};

export default ButtonPages;
