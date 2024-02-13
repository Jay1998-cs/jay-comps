export const resetComponentStyle = (
  token: any,
  needInheritFontFamily = false
) => ({
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  color: token?.colorText || "#000",
  fontSize: token?.fontSize || "14px",
  // font-variant: @font-variant-base;
  lineHeight: token?.lineHeight || "1.57",
  listStyle: "none",
  // font-feature-settings: @font-feature-settings-base;
  fontFamily: needInheritFontFamily
    ? "inherit"
    : token?.fontFamily || "inherit",
});
