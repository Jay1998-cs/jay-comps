import React from "react";
import { Typography } from "../../components";

const TitlePage = () => {
  const { Title } = Typography;

  return (
    <div className="dev-title-page">
      <Title>h1. jay-comps</Title>
      <Title level={2}>h2. jay-comps</Title>
      <Title level={3}>h3. jay-comps</Title>
      <Title level={4}>h4. jay-comps</Title>
      <Title level={5}>h5. jay-comps</Title>
    </div>
  );
};

export default TitlePage;
