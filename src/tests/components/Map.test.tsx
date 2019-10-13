import React from "react";

import { configure, shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Map from "components/Map/Map";
import Taxi from "components/Taxi/Taxi";

configure({adapter: new Adapter()});

describe('<Map />', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(<Map />);
    });

    it('should not render <Taxi /> when not receiving taxi data from the API', () => {
        expect(wrapper.find(Taxi).exists()).toEqual(false);
    });

    it('should render <Taxi /> when receiving taxi data from the API', () => {
        wrapper.setState({
            taxis: [{
                driver_id: "0-qlxfe2djfvq",
                location: {
                    bearing: 232,
                    latitude: 51.511752361083,
                    longitude: -0.09174225217834339
                } 
            }]
        });
        
        expect(wrapper.find(Taxi).exists()).toEqual(true);
    });
});

