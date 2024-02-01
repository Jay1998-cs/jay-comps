import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

import { Button } from "../../components";

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
  const marginStyle = {
    margin: "5px 0px",
  };
  return <div style={Object.assign({}, marginStyle, style)}>{children}</div>;
};

const DefinedButtonPage = () => {
  const bgStyle = { background: "rgb(200,200,200)", padding: "20px" };
  const [loadings, setLoadings] = useState([]);

  const clickBtn = () => {
    alert("click btn");
  };

  const setBtnEnterLoading = (index) => {
    // 开启下标为index的loading状态
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    // 设置delay延迟后关闭loading状态
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };

  return (
    <FlexCol id="dev-button-page">
      <h2>Defined Button</h2>

      <h3>五种按钮类型: type属性</h3>
      <FlexRow>
        <Button onClick={clickBtn}>Button</Button>
        <Button type="default">Default Button</Button>
        <Button type="primary">Primary Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
      </FlexRow>

      <h3>幽灵按钮: ghost属性</h3>
      <FlexRow style={bgStyle}>
        <Button>Default Button</Button>
        <Button ghost>Default Ghost</Button>
        <Button type="primary" ghost>
          Primary Ghost
        </Button>
        <Button type="dashed" ghost>
          Dashed Ghost
        </Button>
        <Button type="text" ghost>
          Text Ghost
        </Button>
        <Button type="link" ghost>
          Link Ghost
        </Button>
      </FlexRow>

      <h3>危险按钮: danger属性</h3>
      <FlexRow>
        <Button>Default Button</Button>
        <Button danger>Default Danger</Button>
        <Button type="primary" danger>
          Primary Danger
        </Button>
        <Button type="dashed" danger>
          Dashed Danger
        </Button>
        <Button type="text" danger>
          Text Danger
        </Button>
        <Button type="link" danger>
          Link Danger
        </Button>
      </FlexRow>

      <h3>禁用按钮: disabled属性</h3>
      <FlexRow>
        <Button disabled onClick={clickBtn}>
          Default Disabled
        </Button>
        <Button disabled ghost>
          Ghost Disabled
        </Button>
        <Button type="primary" disabled>
          Primary Disabled
        </Button>
        <Button type="dashed" disabled>
          Dashed Disabled
        </Button>
        <Button type="text" disabled>
          Text Disabled
        </Button>
        <Button type="link" disabled>
          Link Disabled
        </Button>
      </FlexRow>

      <h3>按钮尺寸: size属性</h3>
      <FlexRow>
        <Button size="large">Default Large</Button>
        <Button type="primary" size="small">
          Primary Samll
        </Button>
        <Button type="dashed" size="large">
          Dashed Large
        </Button>
        <Button type="text" size="small">
          Text Samll
        </Button>
        <Button type="link" size="large" disabled>
          Link Large Disabled
        </Button>
        <Button type="primary" size="large" danger>
          Primary Danger Large
        </Button>
      </FlexRow>

      <h3>按钮形状: shape属性</h3>
      <FlexRow>
        <Button shape="circle">Default Circle</Button>
        <Button shape="circle" disabled>
          Default Disabled Circle
        </Button>
        <Button type="primary" shape="circle">
          C
        </Button>
        <Button type="primary" shape="round">
          Primary Round
        </Button>
        <Button type="primary" shape="round" danger>
          Primary Danger Round
        </Button>
        <Button type="dashed" shape="circle">
          Dashed Circle
        </Button>
      </FlexRow>

      <h3>图标按钮: icon属性</h3>
      <FlexRow>
        <Button icon={<SearchOutlined />} />
        <Button icon={<SearchOutlined />}>Search Default</Button>
        <Button icon={<SearchOutlined />} type="primary" shape="round">
          Search Primary
        </Button>
        <Button icon={<SearchOutlined />} shape="circle" type="dashed" />
        <Button icon={<SearchOutlined />} type="link">
          Search Link
        </Button>
        <Button icon={<SearchOutlined />} type="text" danger>
          Search Danger Text
        </Button>
      </FlexRow>

      <h3>加载按钮: loading属性</h3>
      <FlexRow>
        <Button type="primary" loading onClick={clickBtn}>
          Loading
        </Button>
        <Button type="dashed" icon={<SearchOutlined />} loading />
        <Button
          type="primary"
          onClick={() => {
            setBtnEnterLoading(0);
          }}
          shape="round"
          danger
          loading={loadings[0]}
        >
          Click me!
        </Button>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          shape="circle"
          loading={loadings[1]}
          onClick={() => {
            setBtnEnterLoading(1);
          }}
        ></Button>
      </FlexRow>

      <h3>按钮宽度100%: block属性</h3>
      <div style={{ ...bgStyle, width: "30%" }}>
        <DIV>
          <Button>Default Button</Button>
        </DIV>
        <DIV>
          <Button block>Default Block</Button>
        </DIV>
        <DIV>
          <Button type="primary" block>
            Primary Block
          </Button>
        </DIV>
        <DIV>
          <Button type="dashed" block danger>
            Dashed Danger Block
          </Button>
        </DIV>
      </div>
    </FlexCol>
  );
};

export default DefinedButtonPage;
