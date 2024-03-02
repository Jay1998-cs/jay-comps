import React from "react";
import { createRoot } from "react-dom/client";
import JcDevApp from "./App";

const rootElem = document.getElementById("root");

if (!rootElem) {
  console.log("createRoot(rootElem), but rootElem is null at index.js");
  process.exit(0);
}

const root = createRoot(rootElem);
root.render(<JcDevApp />);
