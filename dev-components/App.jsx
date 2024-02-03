import React from "react";

// import ButtonPages from "./button";
import TypographyPages from "./typography";

const App = () => {
  // 引入待调试的组件页
  let devPage;

  // devPage = <ButtonPages pageKey="defined" />;
  devPage = <TypographyPages />;

  return devPage;
};

export default App;
