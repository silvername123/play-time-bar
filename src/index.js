import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import PlayTimeBar from "./playTimeBar";
import dayjs from "dayjs";
const App = () => {
  const testTime = {
    startTime: dayjs(dayjs().format("YYYY-MM-DD HH:00:00")).subtract(6, "hour"),
    endTime: dayjs(dayjs().format("YYYY-MM-DD HH:00:00")).add(6, "hour"),
  };
  const [nowTime, setNowTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));

  return (
    <div style={{ margin: "20px", width: "90%", height: "200px" }}>
      <PlayTimeBar
        nowTime={nowTime}
        timeDataList={[testTime]}
        onMouseMove={(time, isDown) => {
          console.log(time, isDown);
          if (isDown) {
            setNowTime(time);
          }
        }}
      />
    </div>
  );
};

const root = document.getElementById("root");
const rootContainer = createRoot(root);
rootContainer.render(<App />);
