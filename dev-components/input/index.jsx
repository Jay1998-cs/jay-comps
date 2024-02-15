import React from "react";

import Input from "../../components/input/Input";
import { Button, Flex } from "../../components";
import {
  InfoCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const demoSize = (
  <Flex gap={20} style={{ width: "60%" }}>
    <Input />
    <Input size="small" placeholder="size='small'" />
    <Input placeholder="default size='middle'" />
    <Input size="large" placeholder="size='large'" />
  </Flex>
);

const demoStatus = (
  <Flex gap={20} style={{ width: "60%" }}>
    <Input placeholder="status='error'" status="error" />
    <Input placeholder="status='warning'" status="warning" />
    <Input placeholder="status='error' disabled" status="error" disabled />
  </Flex>
);

const demoDisabledAndBorder = (
  <Flex gap={20} style={{ width: "60%" }}>
    <Input placeholder="disabled" disabled />
    <Input placeholder="...input with border='false'" bordered={false} />
    <Input placeholder="...borderless and disabled" bordered={false} disabled />
  </Flex>
);

const demoPrefixSuffix = (
  <Flex vertical gap={10} style={{ width: "240px" }}>
    <Input prefix="￥" suffix="RMB" type="number" />
    <Input
      placeholder="Enter your username"
      prefix={<UserOutlined />}
      suffix={<InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
    />
    <Input prefix="password:" type="password" status="warning" />
    <Input prefix="￥" suffix="RMB" type="number" status="error" />
    <Input prefix="身高:" suffix="cm" type="number" bordered={false} />
    <Input
      prefix="阅读:"
      suffix="次"
      bordered={false}
      disabled
      defaultValue={99}
    />
    <Input
      placeholder="disabled"
      prefix="作者:"
      disabled
      defaultValue="苏轼"
      size="small"
    />
  </Flex>
);

const DemoPrefixSuffixNode = () => {
  const selectStyle = {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
  };
  const beforeElem = (
    <select style={selectStyle}>
      <option>https</option>
      <option>http</option>
    </select>
  );
  const afterElem = (
    <select style={selectStyle}>
      <option>.com</option>
      <option>.cn</option>
    </select>
  );

  return (
    <Flex vertical gap={10} style={{ width: "300px" }}>
      <div>下拉框:</div>
      <Input prefix={beforeElem} suffix={afterElem} placeholder="www.baidu" />

      <div>搜索框:</div>
      <Input
        fillWrapper
        suffix={
          <Button
            icon={<SearchOutlined />}
            type="primary"
            style={{
              borderRadius: "0 4px 4px 0",
            }}
            onClick={() => alert("click suffix btn")}
          >
            Search
          </Button>
        }
        placeholder="input..."
      />
    </Flex>
  );
};

const InputPage = () => {
  return (
    <div className="dev-input-page">
      <h1>Input</h1>

      <h2>size属性</h2>
      {demoSize}

      <h2>status属性</h2>
      {demoStatus}

      <h2>disabled和border属性</h2>
      {demoDisabledAndBorder}

      <h2>prefix和suffix属性</h2>
      {demoPrefixSuffix}

      <h2>Input封装示例</h2>
      <DemoPrefixSuffixNode />
    </div>
  );
};

export default InputPage;
