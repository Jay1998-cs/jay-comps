export const animationComponents = ["spin"];

export type AnimationConfigType = Record<string, string>;
export type AnimationMapType = Record<string, AnimationConfigType>;

export const animationMap: AnimationMapType = {
  spin: {
    spinRotate: "@keyframes spinRotate{to{transform:rotate(360deg);}}",
    spinMove: "@keyframes spinMove{to{opacity:1;}}",
  },
};
