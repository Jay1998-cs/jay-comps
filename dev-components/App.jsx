import React from "react";

// import ButtonPages from "./button";
// import TypographyPages from "./typography";
import FlexPage from "./flex";

const App = () => {
  // 引入待调试的组件页
  let devPage;

  // devPage = <ButtonPages pageKey="defined" />;
  // devPage = <TypographyPages />;
  devPage = <FlexPage />;

  return devPage;
};

export default App;
