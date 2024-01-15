import React from "react";
import { render } from "@testing-library/react";

import Button from "..";
import { describe } from "node:test";

describe("Button", () => {
  test("render the Button Componnet", () => {
    render(<Button msg="hello, world!" />);
  });
});
