import React from "react";

import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

import Map from "components/Map/Map";
import MaterialSlider from "components/MaterialSlider/MaterialSlider";

import "./App.css";

export type AppState = {
  currentApiMaxValue: number,
}

export default class App extends React.Component<{}, AppState> {

  onChange$ = new Subject();

  constructor(props: any) {
    super(props);

    this.state = {
      currentApiMaxValue: 25
    }
  }

  componentDidMount() {
    /* On slider range change fetch the data with a 500ms debounce */
    this.onChange$
      .pipe(
        distinctUntilChanged()
      )
      .subscribe((val: any) => {
        this.setState({
          currentApiMaxValue: val
        });
      });
  }

  render() {
    return (
      <div className="react-map">
        <div className="map-container">
          <Map apiLimit={this.state.currentApiMaxValue} />
        </div>
        <div className="slider-container">
          <MaterialSlider
            range={{ min: 1, max: 50 }}
            step={1}
            currentApiMaxValue={this.state.currentApiMaxValue}
            changeValue={(e: React.ChangeEvent<{}>, val: number | number[]) => this.onChange$.next(val)}
          />
        </div>
      </div>
    );
  }
}
