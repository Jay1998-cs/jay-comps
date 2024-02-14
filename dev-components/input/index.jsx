import React from "react";

import Input from "../../components/input/Input";
import { Flex } from "../../components";

const InputPage = () => {
  return (
    <div className="dev-input-page">
      <h1>Input</h1>

      <h2>size属性设置大小</h2>
      <Flex gap={20} style={{ width: "60%" }}>
        <Input size="small" placeholder="size='small'" />
        <Input placeholder="default size='middle'" />
        <Input size="large" placeholder="size='large'" />
      </Flex>

      <h2>其他(disabled borderless)</h2>
      <Flex gap={20} style={{ width: "60%" }}>
        <Input placeholder="disabled input" disabled />
        <Input placeholder="borderless input..." bordered={false} />
      </Flex>
    </div>
  );
};

export default InputPage;
