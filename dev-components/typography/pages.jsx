import React from "react";
import { TitlePage, TextPage } from "./";

const Head = ({ children }) => (
  <h2 style={{ color: "darkBlue" }}>{children}</h2>
);

const TypographyPages = () => {
  // let page = <TitlePage />;

  return (
    <div className="dev-typography">
      <Head>排版 Typography</Head>
      <Head>标题组件 Title</Head>
      {<TitlePage />}
      <Head>文本组件 Text</Head>
      {<TextPage />}
    </div>
  );
};

export default TypographyPages;
