import React from "react";

import taxi from "assets/images/taxi.png";

import "./Taxi.css";

export type TaxiProps = {
    id: string,
    bear: number,
    lat: number,
    lng: number,
}

const Taxi = (props: TaxiProps) => (
    <div className="taxi" data-id={props.id} data-bearings={props.bear}>
        <img src={taxi} className="taxi-icon" alt="taxi-icon" />
    </div>
);

export default Taxi;