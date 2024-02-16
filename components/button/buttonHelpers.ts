import { BaseButtonProps } from "./button";
import { LegacyButtonType } from "./buttonTypes";

export function convertLegacyProps(
  type?: LegacyButtonType
): Pick<BaseButtonProps, "danger" | "type"> {
  if (type === "danger") {
    return { danger: true };
  }
  return { type };
}
