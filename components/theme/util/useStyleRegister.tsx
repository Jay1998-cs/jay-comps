import React from "react";

export default function useStyleRegister(
  info: {
    token: any;
    path: string[];
    hashId?: string;
  },
  styleFn: () => any
) {
  return (node: React.ReactElement) => <React.Fragment>{node}</React.Fragment>;
}
