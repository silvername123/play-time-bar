import React from "react";
import dayjs from "dayjs";
type DateType = {
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
};
interface TimeProgressProps {
    nowTime?: string;
    timeDataList?: DateType[];
    onMouseMove?: (time: string, isDown: boolean) => void;
    onMouseLeave?: (isDown: boolean) => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseEnter?: () => void;
    onMouseleaveCanvasMove?: (time: string) => void;
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
    centerSetting?: {
        fontSize?: number;
        color?: string;
        y?: number;
        width: number;
    };
    isZoom?: boolean;
}
export declare const PlayTimeBar: React.FC<TimeProgressProps>;
export default PlayTimeBar;
