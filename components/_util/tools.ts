/**
 * @returns (typeof num === "number") ? `${num}px` : num
 */
export const unit = (num: any) => {
  return typeof num === "number" ? `${num}px` : num;
};
