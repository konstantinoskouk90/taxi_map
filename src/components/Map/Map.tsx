import React from "react";

import { Subject, Subscription, Observable } from "rxjs";
import { timer } from "rxjs";
import { debounceTime } from "rxjs/operators";
import axios from "axios";
import GoogleMapReact from "google-map-react";

import Taxi from "components/Taxi/Taxi";

import { ITaxi } from "interfaces/Map";

import "./Map.css";

export type MapProps = {
    apiLimit: number,
}

export type MapState = {
    center: { lat: number, lng: number },
    taxis: ITaxi[] | null,
}

export default class Map extends React.Component<MapProps,MapState> {
    /* Map default static configurations */
    static apiKey: string = "<YOUR_GOOGLE_MAPS_API_KEY>";
    static apiReqPath: string = "<YOUR_PROXY_DOMAIN_PATHNAME>";
    static center: { lat: number, lng: number } = { lat: 51.5049375, lng: -0.0964509 };
    static zoom: number = 13;

    /* Map default props that can be updated by a parent component */
    static defaultProps = {
        apiLimit: 50,
    };

    subscription = new Subscription();
    onDrag$ = new Subject();

    constructor(props: MapProps) {
        super(props);
        
        this.state = {
            center: { lat: 51.5049375, lng: -0.0964509 },
            taxis: null,
        }
    }

    componentDidMount(): void {
        const observable: Observable<number> = timer(0, 60000);

        /* Poll the taxi data every 60 seconds to show up to date locations */
        this.subscription = observable.subscribe(() => this.getTaxis(this.state.center.lat, this.state.center.lng));

        /* On map drag fetch the latest data based on the new coordinates with a 500ms debounce */
        this.onDrag$
            .pipe(
                debounceTime(500),
            )
            .subscribe((e: any) => {
                this.getTaxis(e.center.lat(), e.center.lng());
            });
    }

    componentDidUpdate(prevProps: MapProps): void {
        if (prevProps.apiLimit !== this.props.apiLimit) {
            /* Refetch the data and update the state when new updated props are received */
            this.getTaxis(this.state.center.lat, this.state.center.lng, this.props.apiLimit);
        }
    }

    componentWillUnmount(): void {
        this.subscription.unsubscribe();
        this.onDrag$.unsubscribe();
    }

    async getTaxis(lat: number, lng: number, limit: number = this.props.apiLimit): Promise<void> {
        const response = await axios.get((Map.apiReqPath), {
            params: {
                latitude: lat,
                longitude: lng,
                count: limit
            }
        });

        this.setState({
            taxis: response.data.drivers,
            center: {
                lat: lat,
                lng: lng,
            }
        });
    }

    render() {
        return (
            <div className="map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: Map.apiKey }}
                    defaultCenter={Map.center}
                    center={this.state.center}
                    defaultZoom={Map.zoom}
                    onDrag={e => this.onDrag$.next(e)}
                >
                    {this.state && this.state.taxis ? this.state.taxis.map((
                        taxi: ITaxi,
                        index: number
                    ) => {
                        return <Taxi
                            key={index.toString()}
                            id={taxi.driver_id}
                            bear={taxi.location.bearing}
                            lat={taxi.location.latitude}
                            lng={taxi.location.longitude}
                        />;
                    },
                    ) : null}
                </GoogleMapReact>
            </div>
        );
    }
}