import React from "react";

export interface BaseButtonProps {
  size?: "samll" | "media" | "large";
  msg?: string;
}

const Button: React.FC<BaseButtonProps> = (props) => {
  const { msg = "" } = props;

  const btnClickHandler = () => {
    console.log(msg + "【click button event】");
  };

  return (
    <div onClick={btnClickHandler}>
      <button style={{ color: "blue" }}>Button</button>
    </div>
  );
};

export default Button;
