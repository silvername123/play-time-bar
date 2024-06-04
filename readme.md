Usage

```javascript
import PlayTimeBar from '@slivername/play-time-bar';

const Component = () => {
  
  const [nowTime, setNowTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  return (
    <div style={{ margin: "20px", width: "90%", height: "200px" }}>
      <PlayTimeBar
        nowTime={nowTime}
        timeDataList={[rangeTime]}
        onMouseMove={(time, isDown) => {
          if (isDown) {
            setNowTime(time);
          }
        }}
      />
    </div>
  );

}
```

``