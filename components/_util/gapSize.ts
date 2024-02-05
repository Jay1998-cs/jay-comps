import type { SizeType } from "../config-provider/SizeContext";

export function isPresetSize(
  size?: SizeType | string | number
): size is SizeType {
  return ["small", "middle", "large"].includes(size as string);
}
