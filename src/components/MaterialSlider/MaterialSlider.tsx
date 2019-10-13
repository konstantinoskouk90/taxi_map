import React from "react";

import Slider from "@material-ui/core/Slider";

import "./MaterialSlider.css";

export type SliderProps = {
    range: {
        min: number,
        max: number
    },
    step: number,
    currentApiMaxValue: number,
    changeValue: ((event: React.ChangeEvent<{}>, value: number | number[]) => void) | undefined;
}

const MaterialSlider = (props: SliderProps) => (
    <div className="slider">
        <div>{props.range.min}</div>
        <Slider
            defaultValue={props.currentApiMaxValue}
            min={props.range.min}
            max={props.range.max}
            onChangeCommitted={props.changeValue}
            step={props.step}
        >
        </Slider>
        <div>{props.range.max}</div>
    </div>
);

export default MaterialSlider;