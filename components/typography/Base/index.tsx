import React from "react";
import { TypographyProps } from "../Typography";
import type { TooltipProps } from "../../tooltip";

export type BaseType = "secondary" | "success" | "warning" | "danger";

interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

interface CopyConfig {
  text?: string;
  onCopy?: (event?: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  tooltips?: boolean | React.ReactNode;
  format?: "text/plain" | "text/html";
}

interface EditiConfig {
  text?: string;
  editing?: boolean;
  icon?: React.ReactNode;
  tooltip?: boolean | React.ReactNode;
  onStart?: () => void;
  onChange?: (value?: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
  maxLength?: number;
  autoSize?: boolean | AutoSizeType;
  triggerType?: ("icon" | "text")[];
  enterIcon?: React.ReactNode;
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: React.ReactNode;
  onExpand?: React.MouseEventHandler<HTMLElement>;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: React.ReactNode | TooltipProps;
}

export interface BlockProps<
  C extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements
> extends TypographyProps<C> {
  title?: string;
  editable?: boolean | EditiConfig;
  copyable?: boolean | CopyConfig;
  type?: BaseType;
  disabled?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  // decorations
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  keyboard?: boolean;
  italic?: boolean;
}

////////////////////////// Base //////////////////////////
const Base = React.forwardRef<HTMLElement, BlockProps>((props, ref) => {
  return null;
});

export default Base;
