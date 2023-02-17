import React from 'react';
import './styles.css';
import Leaflet from './Map';
import DroneMap from './components/drift-marker/DriftMarker';
const path = [
    [12.123, 77.4194],
    [12.123, 77.4193],
    [12.123, 77.4192],
    [12.123, 77.4191],
    [12.2345, 77.419],
    [12.3744, 77.4189],
    [12.2743, 77.4188],
    [12.1742, 77.4187],
    [12.1741, 77.4186],
    [12.274, 77.4185]
];
export default () => <Leaflet />;
