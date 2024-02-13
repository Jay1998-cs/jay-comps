import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

import { Flex, Spin } from "../../components";

const Content = ({ children }) => (
  <div
    style={{
      padding: "50px",
      background: "rgba(0, 0, 0, 0.05)",
    }}
  >
    {children}
  </div>
);

const demo1 = (
  <Flex gap={10}>
    <Spin size="small" />
    <Spin />
    <Spin size="large" />
  </Flex>
);

const demo2 = (
  <Flex vertical gap={30}>
    <div>如设置Spin的属性tip='Loading'可以定义提示文字</div>
    <Flex gap={30}>
      <Spin tip="Loading" size="small">
        <Content>small</Content>
      </Spin>

      <Spin tip="Loading">
        <Content>default</Content>
      </Spin>

      <Spin tip="Loading" size="large">
        <Content>large</Content>
      </Spin>
    </Flex>

    <Spin tip="加载中">
      <Content>...Loading Content...</Content>
    </Spin>
  </Flex>
);

const demo3 = (
  <Flex>
    <Spin indicator={<LoadingOutlined />} size="large" tip="正在加载">
      <Content>...Spin包裹的内容...</Content>
    </Spin>
  </Flex>
);

const SpinDelay = () => {
  const [spinning, setSpinning] = React.useState(false);

  return (
    <Flex vertical gap={10}>
      <div>
        <span>关闭或2s后开启loading效果: </span>
        <button
          onClick={() => {
            setSpinning((s) => !s);
          }}
        >
          start/stop
        </button>
      </div>
      <Flex>
        <Spin spinning={spinning} delay={2000} tip="loading">
          <Content>设置delay可延迟显示loading效果</Content>
        </Spin>
      </Flex>
    </Flex>
  );
};

const SpinFullScreen = () => {
  const [spinning, setSpinning] = React.useState(false);

  const showLoader = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 3000);
  };

  return (
    <>
      <button onClick={showLoader}>显示全屏Spin三秒钟</button>
      <Spin spinning={spinning} tip="加载全屏loading效果中" fullscreen />
    </>
  );
};

// >>>>>
const SpinPage = () => {
  return (
    <div className="dev-spin-page">
      <h1>Spin</h1>
      <h2>大小: size属性</h2>
      {demo1}
      <h2>内嵌加载内容及tip属性</h2>
      {demo2}
      <h2>自定义加载icon</h2>
      {demo3}
      <h2>延迟显示Loading效果</h2>
      <SpinDelay />
      <h2>全屏Loading效果</h2>
      <SpinFullScreen />
    </div>
  );
};

export default SpinPage;
