import React from "react";
import { ConfigProvider, Typography } from "../../components";

const TitlePage = () => {
  const { Title } = Typography;

  return (
    <div className="dev-title-page">
      <Title>h1. 默认level=1即h1, 使用level属性设置标题</Title>
      <Title level={2}>h2. level=2</Title>
      <Title level={3}>h3. level=3</Title>
      <Title level={4}>h4. level=4</Title>
      <Title level={5}>h5. level=5</Title>
      <ConfigProvider
        theme={{
          token: { colorTextHeading: "pink" },
        }}
      >
        <Title level={5}>custom h5(使用ConfigProvider自定义标题样式)</Title>
      </ConfigProvider>
    </div>
  );
};

export default TitlePage;
