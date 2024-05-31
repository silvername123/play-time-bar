import React from "react";
import { createRoot } from "react-dom/client";

import MyComponent from "./myc";

import { TimeProgress } from "./playTimeBar";
const App = () => (
  <div style={{ margin: "20px", width: "90%", height: "200px" }}>
    <TimeProgress />;
  </div>
);

const root = document.getElementById("root");
const rootContainer = createRoot(root);
rootContainer.render(<App />);
