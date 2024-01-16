import React, { forwardRef } from "react";

export interface BaseButtonProps {
  size?: "samll" | "media" | "large";
  msg?: string;
}

export interface ButtonProps extends BaseButtonProps {
  href?: string;
  htmlType?: "submit" | "button" | "reset";
}

const InternalButton: React.ForwardRefRenderFunction<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
> = (props, ref) => {
  const {} = props;
  return <button>text</button>;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  InternalButton
);

export default Button;
