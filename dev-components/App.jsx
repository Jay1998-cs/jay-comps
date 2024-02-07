import React from "react";

// import ButtonPages from "./button";
// import TypographyPages from "./typography";
// import FlexPage from "./flex";
import GridPage from "./grid";

const App = () => {
  // 引入待调试的组件页
  let devPage;

  // devPage = <ButtonPages pageKey="defined" />;
  // devPage = <TypographyPages />;
  // devPage = <FlexPage />;
  devPage = <GridPage />;

  return devPage;
};

export default App;
