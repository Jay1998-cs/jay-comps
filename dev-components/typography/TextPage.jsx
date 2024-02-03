import React from "react";
import { Typography } from "../../components";

const FlexCol = ({ children, style = {} }) => {
  const columnStyle = {
    display: "flex",
    gap: "5px",
    flexDirection: "column",
  };
  return <div style={Object.assign({}, columnStyle, style)}>{children}</div>;
};

const TextPage = () => {
  const { Text, Link } = Typography;

  return (
    <FlexCol>
      <Text>jay-comps (default)</Text>
      <Text type="secondary">secondary</Text>
      <Text type="success">success</Text>
      <Text type="warning">warning</Text>
      <Text type="danger">danger</Text>
      <Text disabled>disabled</Text>
      <Text mark>mark</Text>
      <Text code>code</Text>
      <Text keyboard>keyboard</Text>
      <Text underline>underline</Text>
      <Text delete>delete</Text>
      <Text strong>strong</Text>
      <Text italic>italic</Text>
      <Link href="https://www.baidu.com" target="_blank">
        jay-comps link
      </Link>
    </FlexCol>
  );
};

export default TextPage;
