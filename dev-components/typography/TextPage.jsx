import React from "react";
import { Typography } from "../../components";

const FlexCol = ({ children, className, style = {} }) => {
  const columnStyle = {
    display: "flex",
    gap: "5px",
    flexDirection: "column",
  };
  return (
    <div className={className} style={Object.assign({}, columnStyle, style)}>
      {children}
    </div>
  );
};

const TextPage = () => {
  const { Text } = Typography;

  return (
    <FlexCol className="dev-text-page">
      <Text>默认文本(default) 等同于span标签</Text>
      <Text type="secondary">type=secondary</Text>
      <Text type="success">type=success</Text>
      <Text type="warning">type=warning</Text>
      <Text type="danger">type=danger</Text>
      <Text disabled>disabled属性</Text>
      <Text mark>mark属性</Text>
      <Text code>code属性</Text>
      <Text keyboard>keyboard属性</Text>
      <Text underline>underline属性</Text>
      <Text delete>delete属性</Text>
      <Text strong>strong属性</Text>
      <Text italic>italic属性</Text>
    </FlexCol>
  );
};

export default TextPage;
