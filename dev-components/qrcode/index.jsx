import React from "react";

import { Flex, QRCode } from "../../components";

const antdIconSrc =
  "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg";

const QRCodePage = () => {
  const [errorLevel, setErrorLevel] = React.useState("L");
  const [size, setSize] = React.useState(100);

  const handleSelectErrorLevel = (e) => {
    setErrorLevel(e?.target?.value || "H");
  };

  const handleSelectSize = (e) => {
    setSize(Number(e?.target?.value));
  };

  return (
    <div className="dev-qrcode-page">
      <h1>QRCode</h1>
      <h2>type='canvas' | 'svg'设置类型</h2>
      <Flex gap={50}>
        <QRCode value="qrcode-canvas" />
        <QRCode value="qrcode-svg" type="svg" />
      </Flex>

      <h2>icon="src"内嵌图标</h2>
      <QRCode value="qrcode-nested-icon" icon={antdIconSrc} />

      <h2>color和bgColor设置颜色</h2>
      <Flex gap={50}>
        <QRCode value="qrcode-color" color="#167fff" />
        <QRCode value="qrcode-bgColor" type="svg" color="#ddd" bgColor="#444" />
      </Flex>

      <h2>errorLevel调整容错等级(L M Q H)</h2>
      <Flex vertical gap={10}>
        <div>
          <span>选择容错等级: </span>
          <select onChange={handleSelectErrorLevel}>
            <option>L</option>
            <option>M</option>
            <option>Q</option>
            <option>H</option>
          </select>
        </div>
        <QRCode value={antdIconSrc} color="green" errorLevel={errorLevel} />
      </Flex>

      <h2>size属性定义尺寸</h2>
      <Flex vertical gap={10}>
        <div>
          <span>选择尺寸: </span>
          <select onChange={handleSelectSize}>
            <option>100</option>
            <option>160</option>
            <option>200</option>
          </select>
        </div>
        <QRCode value="qrcode-define-size" size={size} />
      </Flex>

      <h2>status状态</h2>
      <div style={{ margin: 6 }}>status = loading | expired | scanned</div>
      <Flex gap={20}>
        <QRCode value="qrcode-svg" status="loading" />
        <QRCode
          value="qrcode-svg"
          status="expired"
          onRefresh={() => alert("refresh")}
        />
        <QRCode value="qrcode-svg" status="scanned" />
      </Flex>
    </div>
  );
};

export default QRCodePage;
