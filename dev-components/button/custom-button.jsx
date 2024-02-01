import React, { useState } from "react";
import { Button, ConfigProvider } from "../../components";

const FlexRow = ({ children, style = {} }) => {
  const rowStyle = {
    display: "flex",
    gap: "20px",
    flexDirection: "row",
  };
  return <div style={Object.assign({}, rowStyle, style)}>{children}</div>;
};

const FlexCol = ({ children, style = {} }) => {
  const columnStyle = {
    display: "flex",
    gap: "5px",
    flexDirection: "column",
  };
  return <div style={Object.assign({}, columnStyle, style)}>{children}</div>;
};

const DIV = ({ children, style = {} }) => {
  const divStyle = {
    background: "rgba(0,0,0,0.6)",
    padding: "20px",
    margin: "10px",
  };
  return <div style={Object.assign({}, divStyle, style)}>{children}</div>;
};

const CustomButtonPage = () => {
  const whiteToken = {
    colorPrimary: "rgba(255,255,255)",
    colorPrimaryText: "rgba(0,0,0)",
    colorBgContainer: "rgba(255,255,255,0.8)",
    colorText: "#fff",
    colorLink: "rgba(150,180,255)",
    colorHover: "rgba(150,180,255)",
  };
  const blackToken = {
    colorPrimary: "rgba(0,0,0)",
    colorText: "#000",
    colorLink: "rgba(20,20,255)",
  };

  const [config, setConfig] = useState({
    white: true,
    token: whiteToken,
  });

  const divBgVal = config.white ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.1)";

  const toggleTheme = () => {
    setConfig((preConfig) => {
      const { white } = preConfig;
      if (white) {
        return {
          white: false,
          token: blackToken,
        };
      }
      return {
        white: true,
        token: whiteToken,
      };
    });
  };

  const DynamicDayNightBtns = (
    <DIV style={{ background: divBgVal }}>
      <FlexCol>
        <FlexRow>
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              toggleTheme();
            }}
          >
            单击此处切换主题
          </Button>
        </FlexRow>
        <FlexRow>
          <ConfigProvider theme={{ token: config.token }}>
            <Button type="primary">Primary</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="primary" ghost>
              Primary Ghost
            </Button>
            <Button ghost>Default Ghost</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
          </ConfigProvider>
        </FlexRow>
      </FlexCol>
    </DIV>
  );

  return (
    <div className="custom-button-page">
      <h1>Custom Button</h1>

      <h2>1.内置(默认)按钮</h2>
      <h3>五种类型按钮</h3>
      <FlexRow>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </FlexRow>

      <h2>2.客制按钮</h2>
      <FlexCol>
        <h3>自定义主题: ConfigProvier</h3>
        <div>主题色: 绿色</div>
        <FlexRow>
          <ConfigProvider
            theme={{
              token: {
                // 主题色(绿色)
                colorPrimary: "rgba(31,200,120)",
                colorBgContainer: "rgba(200,255,200)",
              },
            }}
          >
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
            <Button ghost>Ghost Default</Button>
            <Button type="primary" ghost>
              Ghost Primary
            </Button>
            <Button danger>Danger Default</Button>
            <Button disabled>Disabled</Button>
          </ConfigProvider>
        </FlexRow>

        <h3>嵌套 ConfigProvier</h3>
        <div>主题色:紫色，但内部嵌套其他主题(如橙色)按钮 </div>
        <FlexRow>
          <ConfigProvider
            theme={{
              token: {
                // 主题色(紫色)
                colorPrimary: "rgba(150,150,250)",
                colorBgContainer: "rgba(220,220,250)",
              },
            }}
          >
            <Button type="primary">Primay</Button>
            <Button>Default</Button>
            <ConfigProvider
              theme={{
                token: {
                  // 嵌套主题
                  colorPrimary: "rgba(255,160,90)",
                  colorBgContainer: "rgba(255,160,90, 0.5)",
                },
              }}
            >
              <Button type="primary">Nested Primary</Button>
              <Button>Nested Default</Button>
            </ConfigProvider>
            <Button type="dashed">Dashed</Button>
            <Button type="link">Link</Button>
            <Button ghost>Ghost Default</Button>
          </ConfigProvider>
        </FlexRow>
      </FlexCol>

      <h2>3.应用|实践: 动态切换按钮主题色</h2>
      <h3>日夜: 黑白主题</h3>
      {DynamicDayNightBtns}
    </div>
  );
};

export default CustomButtonPage;
