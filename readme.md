Usage

```javascript
import PlayTimeBar from "@slivername/play-time-bar";

const Component = () => {
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
          if (isDown) {
            setNowTime(time);
          }
        }}
      />
    </div>
  );
};
```
