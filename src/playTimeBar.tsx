import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import dayjs from "dayjs";

type DateType = {
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
};
interface TimeProgressProps {
  nowTime?: string;
  timeDataList?: DateType[];
  // isDown 是否按下
  onMouseMove?: (time: string, isDown: boolean) => void;
  onMouseLeave?: (time: string, isDown: boolean) => void;
  onMouseDown?: (time: string, isDown: boolean) => void;
  onMouseUp?: (time: string, isDown: boolean) => void;
  onMouseEnter?: (time: string, isDown: boolean) => void;
  zoomProps?: {
    onZoomIn?: (time: string) => void;
    onZoomOut?: (time: string) => void;
    zoomInMultiplier?: number;
    zoomOutMultiplier?: number;
  };
  maxSize?: number;
  minSize?: number;
  intervalSize?: number;
  lineSetting?: {
    topLine: {
      topColor?: string;
      lineWidth?: number;
      x: number;
      y: number;
    };
    bottomLine: {
      bottomColor?: string;
      lineWidth?: number;
      x: number;
      y: number;
    };
    middleLine: {
      middleColor?: string;
      lineWidth?: number;
      x: number;
      y: number;
    };
    recordBar?: {
      recordColor?: string;
      lineWidth?: number;
      x: number;
      y: number;
    };
    lineText?: {
      fontSize?: number;
      color?: string;
      y?: number;
    };
  };
  isZoom?: boolean;
}
const test = {
  startTime: dayjs(dayjs().format("YYYY-MM-DD HH:00:00")).subtract(1, "hour"),
  endTime: dayjs(dayjs().format("YYYY-MM-DD HH:00:00")).add(1, "hour"),
};
const timeId = null;
const colorObject = {
  topColor: "#FFFF00",
  middleColor: "#303030",
  bottomColor: "#FFFF00",
  recordColor: "#637DEC",
  lineText: {
    fontSize: 12,
    color: "#fff",
  },
};
const defaultSettingObject = {
  topLine: {
    topColor: colorObject.topColor,
    lineWidth: 1,
    x: 0,
    y: 45,
  },
  bottomLine: {
    bottomColor: colorObject.bottomColor,
    lineWidth: 1,
    x: 0,
    y: 54,
  },
  middleLine: {
    middleColor: colorObject.middleColor,
    lineWidth: 8,
    x: 0,
    y: 49.5,
  },
  recordBar: {
    recordColor: colorObject.recordColor,
    lineWidth: 8,
    x: 0,
    y: 45.5,
  },
  lineText: {
    fontSize: 12,
    color: colorObject.lineText.color,
    y: 43,
  },
};
export const PlayTimeBar = (props: TimeProgressProps, ref: any) => {
  const {
    nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss"),
    timeDataList = [test],
    onMouseMove,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    isZoom = true,
    zoomProps = {
      zoomInMultiplier: 1.5,
      zoomOutMultiplier: 1.5,
    },
    maxSize = 400,
    minSize = 100,
    intervalSize = 200,
    lineSetting = {
      ...defaultSettingObject,
    },
  } = props;
  const timeDivRef = useRef<HTMLDivElement | any>();
  const canvasRef = useRef<HTMLCanvasElement | any>();

  const nowDate = nowTime;
  const mouseRef = React.useRef<{
    mousedownX?: number;
    mousedownY?: number;
    status: boolean;
    enterTime?: string;
  }>({
    status: false,
  });

  // 间隔尺寸
  const sizeRef = React.useRef<number>(intervalSize);
  // 每像素对应多少秒 s/px
  const pxToSecondRef = React.useRef<number>((1 * 60 * 60) / sizeRef.current);
  const onDrawTick = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      date: dayjs.Dayjs,
      width: number,
      height: number
    ) => {
      const tempTime = date.valueOf();
      // 距离左侧整点时间
      const nowRecentlyTime = dayjs(
        date.format("YYYY-MM-DD HH:00:00")
      ).valueOf();

      // 距离左侧
      const recentlyLength =
        (tempTime - nowRecentlyTime) / 1000 / pxToSecondRef.current;
      const center = width / 2 - recentlyLength - 1;

      const leftPoints = Math.floor(center / sizeRef.current);
      const rightPoints = Math.floor((width - center) / sizeRef.current);

      // 点数加1 的原因 为了开始把起点的线画上去
      const leftList = Array.from({ length: leftPoints + 1 }, (_, i) => {
        const timeText = dayjs(tempTime).subtract(i, "hour").format("HH:00");
        return {
          x: center - i * sizeRef.current,
          y: lineSetting?.lineText?.y ?? 43,
          text: timeText,
        };
      });
      const rightList = Array.from({ length: rightPoints + 1 }, (_, i) => {
        const timeText = dayjs(tempTime).add(i, "hour").format("HH:00");
        return {
          x: center + i * sizeRef.current,
          y: lineSetting?.lineText?.y,
          text: timeText,
        };
      });
      leftList.forEach((item) => {
        ctx?.beginPath();
        ctx.strokeStyle = "#4B4B4B";
        ctx.lineWidth = 2;
        ctx?.moveTo(item.x, item.y);
        ctx?.lineTo(item.x, height);
        ctx?.stroke();
        ctx.font = `${lineSetting?.lineText?.fontSize} serif`;
        ctx.fillStyle = lineSetting?.lineText?.color ?? "";
        ctx.textAlign = "start";
        ctx.fillText(item.text, item.x - 14, item.y - 6);
      });
      rightList.forEach((item) => {
        ctx?.beginPath();
        ctx.strokeStyle = "#4B4B4B";
        ctx.lineWidth = 2;
        item.y && ctx?.moveTo(item.x, item.y);
        ctx?.lineTo(item.x, height);
        ctx?.stroke();
        ctx.font = `${lineSetting?.lineText?.fontSize ?? "12px"} serif`;
        ctx.fillStyle = lineSetting?.lineText?.color ?? "";
        ctx.textAlign = "start";
        item.y && ctx.fillText(item.text, item.x - 14, item.y - 6);
      });
    },
    []
  );
  // 绘制存在视频记录区域
  const onDrawRecordArea = React.useCallback(
    (ctx, width, height, date: dayjs.Dayjs, timeData: DateType[]) => {
      // 当前时间的毫秒数
      const temptime = date.valueOf();
      // 左侧顶点的时间秒数
      const leftVertexTime =
        temptime / 1000 - (width / 2) * pxToSecondRef.current;
      // 右侧顶点的时间秒数
      const rightVertexTime =
        temptime / 1000 + (width / 2) * pxToSecondRef.current;
      // 在可视范围内的视频记录 如果以后要多个时间段，可以在这里添加
      const timeList = timeData.filter((r) => {
        const startTimeSecond = r.startTime.valueOf() / 1000;
        const endTimeSecond = r.endTime.valueOf() / 1000;
        if (
          (startTimeSecond < leftVertexTime &&
            endTimeSecond > leftVertexTime) ||
          (startTimeSecond >= leftVertexTime &&
            startTimeSecond < rightVertexTime)
        ) {
          return true;
        }
        return false;
      });
      timeList.map((r) => {
        const startTimeSecond = r.startTime.valueOf() / 1000;
        const endTimeSecond = r.endTime.valueOf() / 1000;
        //如果起始时间比左侧顶点时间小，说明区域从左侧顶点开始
        if (startTimeSecond < leftVertexTime) {
          // 获取该时间段在可视范围的长度
          const W =
            endTimeSecond < rightVertexTime
              ? (endTimeSecond - leftVertexTime) / pxToSecondRef.current
              : width;

          // 绘制播放长度 矩形区域
          ctx.beginPath();
          ctx.fillStyle = lineSetting.recordBar?.recordColor;
          ctx.fillRect(
            0,
            lineSetting.recordBar?.y,
            W,
            lineSetting.recordBar?.lineWidth
          );
        }
        // 如果起始时间在可视范围内
        if (startTimeSecond >= leftVertexTime) {
          // 算出起始时间的X位置
          const X = (startTimeSecond - leftVertexTime) / pxToSecondRef.current;
          const W = (endTimeSecond - startTimeSecond) / pxToSecondRef.current; // 记录长度
          // 绘制播放长度 矩形区域
          ctx.beginPath();
          ctx.fillStyle = lineSetting.recordBar?.recordColor;
          ctx.fillRect(
            X,
            lineSetting.recordBar?.y,
            W,
            lineSetting.recordBar?.lineWidth
          );
        }
        return true;
      });
    },
    []
  );
  const onDrawDate = (
    ctx: CanvasRenderingContext2D | null,
    date: string,
    width: number
  ) => {
    if (!ctx) {
      return;
    }
    ctx.font = "16px serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(date, width / 2 - 10, 20);
  };

  const onFill = React.useCallback(
    (ctx: CanvasRenderingContext2D, width, height, time: DateType[]) => {
      ctx.beginPath();
      ctx.strokeStyle =
        lineSetting.middleLine.middleColor ?? colorObject.middleColor;
      //   ctx.strokeStyle = "red";
      ctx.lineWidth =
        lineSetting.middleLine.lineWidth ??
        defaultSettingObject.middleLine.lineWidth;
      const timeLineY = lineSetting.middleLine.y;
      ctx.moveTo(0, timeLineY);
      ctx.lineTo(width, timeLineY);
      ctx.stroke();
      // 绘制轴线
      onDrawTick(ctx, dayjs(nowDate), width, height);
      onDrawRecordArea(ctx, width, height, dayjs(nowDate), time);
      // 时间线区域线
      ctx.beginPath();
      const timeLineBottomY = lineSetting.bottomLine.y;
      ctx.strokeStyle =
        lineSetting.bottomLine.bottomColor ??
        defaultSettingObject.bottomLine.bottomColor;
      //   ctx.strokeStyle = "green";
      ctx.lineWidth =
        lineSetting.bottomLine.lineWidth ??
        defaultSettingObject.bottomLine.lineWidth;
      ctx.moveTo(0, timeLineBottomY);
      ctx.lineTo(width, timeLineBottomY);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle =
        lineSetting.topLine.topColor ?? defaultSettingObject.topLine.topColor;
      //   ctx.strokeStyle = "blue";
      const timeLineTopY = lineSetting.topLine.y;

      ctx.lineWidth =
        lineSetting.topLine.lineWidth ?? defaultSettingObject.topLine.lineWidth;
      ctx.moveTo(0, timeLineTopY);
      ctx.lineTo(width, timeLineTopY);
      ctx.stroke();
      // 中间时间线
      ctx.beginPath();
      ctx.strokeStyle = "#ffcc00";
      ctx.lineWidth = 2;
      ctx.moveTo(width / 2 - 1 + 0.5, 0);
      ctx.lineTo(width / 2 - 1 + 0.5, height);
      ctx.stroke();
    },
    [
      lineSetting.bottomLine.bottomColor,
      lineSetting.bottomLine.lineWidth,
      lineSetting.bottomLine.y,
      lineSetting.middleLine.lineWidth,
      lineSetting.middleLine.middleColor,
      lineSetting.middleLine.y,
      lineSetting.topLine.lineWidth,
      lineSetting.topLine.topColor,
      lineSetting.topLine.y,
      nowDate,
      onDrawRecordArea,
      onDrawTick,
    ]
  );
  const mouseFunction = React.useCallback(
    (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      time: DateType[]
    ) => {
      const width = canvas.width;
      let mouseTime = nowDate;
      canvas.onmouseenter = (e) => {
        onMouseEnter?.(mouseTime, mouseRef.current.status);
      };

      canvas.onmousemove = (e) => {
        if (mouseRef.current.status) {
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onFill(ctx, canvas.width, canvas.height, time);
        const w = canvas.width;
        ctx.beginPath();
        ctx.font = "12px serif";
        ctx.fillStyle = "#969696";
        const center = w / 2;
        const offsetX = center - e.offsetX;
        const offsetTime = Math.abs(offsetX) * pxToSecondRef.current;
        if (offsetX > 0) {
          ctx.fillText(
            dayjs(nowDate).subtract(offsetTime, "s").format("HH:mm:ss"),
            e.offsetX,
            10
          );
        } else if (offsetX < 0) {
          ctx.fillText(
            dayjs(nowDate).add(offsetTime, "s").format("HH:mm:ss"),
            e.offsetX,
            10
          );
        }
        onDrawDate(ctx, nowDate, canvas.width);
      };
      // 移动
      document.onmousemove = (e) => {
        if (mouseRef.current.status) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onFill(ctx, canvas.width, canvas.height, time);
          if (!mouseRef.current.mousedownX) {
            return;
          }
          // 计算偏移量
          const offsetX = mouseRef.current.mousedownX - e.clientX;
          const offsetTime = Math.abs(offsetX) * pxToSecondRef.current;
          if (offsetX > 0) {
            mouseTime = dayjs(mouseRef.current.enterTime)
              .add(offsetTime, "s")
              .format("YYYY-MM-DD HH:mm:ss");
          } else if (offsetX <= 0) {
            mouseTime = dayjs(mouseRef.current.enterTime)
              .subtract(offsetTime, "s")
              .format("YYYY-MM-DD HH:mm:ss");
          }
          onDrawDate(ctx, mouseTime, canvas.width);
          onMouseMove?.(mouseTime, mouseRef.current.status);
        }
      };
      // 离开
      canvas.onmouseleave = (e) => {
        if (!mouseRef.current.status) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onFill(ctx, canvas.width, canvas.height, time);
          onDrawDate(ctx, nowDate, canvas.width);
          // 脱离区域停止拖动 清除状态
          mouseRef.current.status = false;
          mouseRef.current.mousedownX = undefined;
          mouseRef.current.mousedownY = undefined;
          mouseRef.current.enterTime = undefined;
        }
        onMouseLeave?.(mouseTime, mouseRef.current.status);
      };
      // 抬起
      document.onmouseup = () => {
        // if (mouseRef.current.status) {
        // }
        onMouseUp?.(mouseTime, mouseRef.current.status);
        mouseRef.current.status = false;
        mouseRef.current.mousedownX = undefined;
        mouseRef.current.mousedownY = undefined;
        mouseRef.current.enterTime = undefined;
      };
      canvas.onmouseup = (e) => {};
      // 按下
      canvas.onmousedown = (e) => {
        mouseRef.current.status = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onFill(ctx, canvas.width, canvas.height, time);
        onDrawDate(ctx, nowDate, canvas.width);
        mouseRef.current.mousedownX = e.clientX;
        mouseRef.current.mousedownY = e.clientY;
        mouseRef.current.enterTime = nowDate;
        onMouseDown?.(mouseTime, mouseRef.current.status);
      };
    },
    [
      nowDate,
      onFill,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      onMouseUp,
    ]
  );
  const onZoomIn = () => {
    if (sizeRef.current >= maxSize) {
      return;
    }
    zoomProps.onZoomIn?.(nowDate);
    sizeRef.current = sizeRef.current * (zoomProps.zoomInMultiplier ?? 1.5);
    pxToSecondRef.current = (1 * 60 * 60) / sizeRef.current;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onFill(
        ctx,
        canvasRef.current.width,
        canvasRef.current.height,
        timeDataList
      );
      onDrawDate(ctx, nowDate, canvasRef.current.width);
    }
  };

  const onZoomOut = () => {
    if (sizeRef.current <= minSize) {
      return;
    }
    zoomProps.onZoomOut?.(nowDate);
    sizeRef.current = sizeRef.current / (zoomProps.zoomOutMultiplier ?? 1.5);
    pxToSecondRef.current = (1 * 60 * 60) / sizeRef.current;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onFill(
        ctx,
        canvasRef.current.width,
        canvasRef.current.height,
        timeDataList
      );
      onDrawDate(ctx, nowDate, canvasRef.current.width);
    }
  };
  const init = React.useCallback(
    (timeText: string, timeList: DateType[]) => {
      if (!canvasRef.current || !timeDivRef.current) {
        return;
      }
      const width = timeDivRef.current.offsetWidth;
      const height = timeDivRef.current.offsetHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, width, height);
      onFill(ctx, width, height, timeList);
      // 绘制日期
      onDrawDate(ctx, timeText, width);
      mouseFunction(canvasRef.current, ctx, timeList);
    },
    [mouseFunction, onFill]
  );
  //   useImperativeHandle(
  //     ref,
  //     () => ({
  //       onPlay: (date) => {
  //         console.log(date);
  //       },
  //     }),
  //     []
  //   );

  useEffect(() => {
    init(nowTime, timeDataList);
  }, [init, timeDataList, nowTime]);

  return (
    <>
      <div
        id="timeProgressBox"
        ref={timeDivRef}
        style={{
          margin: "20px",
          background: "black",
          width: "90%",
          height: "65px",
          position: "relative",
        }}
      >
        {isZoom ? (
          <div
            style={{
              position: "absolute",
              top: "2px",
              right: "5px",
              zIndex: 10,
              width: "40px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                background: "#ffffffd1",
                width: "14px",
                height: "14px",
                lineHeight: "10px",
                textAlign: "center",
              }}
              onClick={onZoomIn}
            >
              +
            </div>
            <div
              style={{
                cursor: "pointer",
                background: "#ffffffd1",
                width: "14px",
                height: "14px",
                lineHeight: "10px",
                textAlign: "center",
              }}
              onClick={onZoomOut}
            >
              -
            </div>
          </div>
        ) : null}

        <canvas id="timeProgress" ref={canvasRef}></canvas>
      </div>
    </>
  );
};

export default PlayTimeBar;
