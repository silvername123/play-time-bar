import React from "react";
import ReactDOM from "react-dom/client";
import MyComponent from "./myc";
const App = () => <MyComponent />;

const root = document.getElementById("root");
const rootContainer = ReactDOM.createRoot(root);
rootContainer.render(<App />);
