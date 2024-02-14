import React from "react";

// import ButtonPages from "./button";
// import TypographyPages from "./typography";
// import FlexPage from "./flex";
// import GridPage from "./grid";
// import SpinPage from "./spin";
// import QRCodePage from "./qrcode";
import InputPage from "./input";

const App = () => {
  // 引入待调试的组件页
  let devPage;

  // devPage = <ButtonPages pageKey="defined" />;
  // devPage = <TypographyPages />;
  // devPage = <FlexPage />;
  // devPage = <GridPage />;
  // devPage = <SpinPage />;
  // devPage = <QRCodePage />;
  devPage = <InputPage />;

  return devPage;
};

export default App;
