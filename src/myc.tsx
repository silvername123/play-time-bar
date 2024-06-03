// src/MyComponent.tsx
import React from "react";
import dayjs from "dayjs";

interface MyComponentProps {
  text: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ text }) => {
  return <div> hello {text}</div>;
};

export default MyComponent;
