const ButtonTypes = ["default", "primary", "dashed", "link", "text"] as const;
export type ButtonType = (typeof ButtonTypes)[number];

export type LegacyButtonType = ButtonType | "danger";

const ButtonShapes = ["default", "circle", "round"] as const;
export type ButtonShape = (typeof ButtonShapes)[number];

const ButtonHTMLTypes = ["submit", "reset", "button"] as const;
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];

export type SizeType = "small" | "middle" | "large" | undefined;
