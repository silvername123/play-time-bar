import React from "react";
import { createRoot } from "react-dom/client";

import MyComponent from "./myc";
const App = () => <MyComponent />;

const root = document.getElementById("root");
const rootContainer = createRoot(root);
rootContainer.render(<App />);
