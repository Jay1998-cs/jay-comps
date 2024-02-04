import React from "react";

import { TitlePage, TextPage, CopyablePage, EllipsisPage } from "./";
import { Typography } from "../../components";

const { Link } = Typography;

const H2 = ({ children }) => <h2 style={{ color: "darkBlue" }}>{children}</h2>;

const TypographyPages = () => {
  return (
    <div className="dev-typography">
      <H2>排版 Typography</H2>
      <H2>1.标题组件 Title</H2>
      {<TitlePage />}

      <H2>2.文本组件 Text</H2>
      {<TextPage />}

      <H2>3.链接组件 Link</H2>
      <Link href="https://www.baidu.com" target="_blank">
        Link Component
      </Link>

      <H2>4.可复制属性 copyable</H2>
      <CopyablePage />

      <H2>5.省略属性 ellipsis</H2>
      <EllipsisPage />
    </div>
  );
};

export default TypographyPages;
