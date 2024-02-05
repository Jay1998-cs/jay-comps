import React from "react";

import { TitlePage, TextPage, CopyablePage, EllipsisPage } from "./";
import { Typography } from "../../components";

const { Link, Paragraph } = Typography;

const H2 = ({ children, level }) => {
  let H = level ? `h${level}` : "h2";
  return <H style={{ color: "darkBlue" }}>{children}</H>;
};

const TypographyPages = () => {
  return (
    <div className="dev-typography">
      <H2 level={1}>排版 Typography</H2>
      <H2>1.标题组件 Title</H2>
      {<TitlePage />}

      <H2>2.文本组件 Text</H2>
      {<TextPage />}

      <H2>3.段落组件 Paragraph</H2>
      <Paragraph>
        这是一个段落,
        不添加任何属性时相当于div标签。通过ConfigProvider可以自定义段落样式,
        如字体颜色(colorText)。
      </Paragraph>

      <H2>4.链接组件 Link</H2>
      <Link href="https://www.baidu.com" target="_blank">
        Link Component (本质上是,封装了CSS样式的a标签)
      </Link>

      <H2>5.可复制属性 copyable</H2>
      <CopyablePage />

      <H2>6.省略属性 ellipsis</H2>
      <EllipsisPage />
    </div>
  );
};

export default TypographyPages;
