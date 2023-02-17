import './Maps.scss';
import React, { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Polyline,
    CircleMarker,
    Popup,
    Marker
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import InputFields from './components/input-fields/InputFields';
import DriftMarker from 'react-leaflet-drift-marker';
import { Icon } from 'leaflet';
import droneIcon from './assets/drone.png';
import ExcelReader from './components/excel-reader/ExcelReader';
import L from 'leaflet';
const path = [
    [12.123, 77.4194],
    [12.23, 77.2193],
    [12.234, 77.5192],
    [12.1523, 77.411],
    [12.4345, 77.3]
    // [12.3744, 77.189],
    // [12.2743, 77.4188],
    // [12.1742, 77.37],
    // [12.171, 77.486],
    // [12.274, 77.218]
];
const Leaflet = () => {
    const [state, setState] = useState(path);
    const [dronePath, setDronePath] = useState([]);
    const [position, setPosition] = useState([]);
    const [isPlay, setIsPlay] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [bounds, setBounds] = useState(null);

    // Set the bounds state
    useState(() => {
        if (dronePath.length >= 2) {
            const polylineBounds = dronePath.reduce((bounds, latlng) => {
                return bounds.extend(latlng);
            }, new L.LatLngBounds(dronePath[0], dronePath[0]));

            setBounds(polylineBounds);
        }
    }, [dronePath]);

    useEffect(() => {
        let localIntervalId;
        if (dronePath.length >= 2) {
            const animate = () => {
                localIntervalId = setInterval(() => {
                    setPosition(dronePath[currentPosition]);
                    setCurrentPosition(prev => {
                        let newPosition = prev + 1;
                        if (newPosition < dronePath.length) {
                            setPosition(dronePath[newPosition]);
                        } else {
                            setPosition(null);
                            setIsPlay(false);
                            clearInterval(intervalId);
                            return 0;
                        }
                        return newPosition;
                    });
                }, 1000);
                setIntervalId(localIntervalId);
            };
            if (isPlay) {
                animate();
            } else {
                clearInterval(intervalId);
            }
        }
        return () => clearInterval(intervalId);
    }, [dronePath, isPlay]);

    function handleChange(index, type) {
        return e => {
            const value = e.target.value;
            const updatedState = state.map((array, id) => {
                if (index === id) {
                    array[type] = value;
                }
                return array;
            });
            setState(updatedState);
        };
    }
    function handleAdd() {
        setState([...state, []]);
    }
    const limeOptions = { color: 'lime' };

    function handleSimulate() {
        const error = state.some(
            array => array.length !== 2 || array.some(elem => elem === '')
        );
        if (!error) {
            setDronePath(state);
            return;
        }
        console.log({ state, error });
        alert(`Please enter all inputs`);
    }

    function handleDelete(destinationId) {
        return e => {
            const updatedState = state.filter(
                (elem, idx) => idx !== destinationId
            );
            setState([...updatedState]);
            // console.log({ destinationId, state, updatedState });
        };
    }

    return (
        <div className="Maps">
            <div className="InputBoxContainer">
                {state.map((props, index) => {
                    console.log(props, index);
                    return (
                        <InputFields
                            key={index}
                            index={index}
                            handleChange={handleChange}
                            state={state}
                            handleDelete={handleDelete}
                        />
                    );
                })}
                <ExcelReader setState={setState} />
                <div className="ButtonsContainer">
                    <button onClick={handleAdd}>+ Add Destination</button>
                    <button onClick={handleSimulate}>Simulate</button>
                </div>
                <div className="ButtonsContainer">
                    <button onClick={() => setIsPlay(prev => !prev)}>
                        {isPlay ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>
            <MapContainer
                bounds={bounds}
                center={dronePath[0] || [12.123, 77.4194]}
                zoom={13}
                style={{ height: '100vh' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline
                    pathOptions={limeOptions}
                    positions={dronePath} //isError ? [] : state
                    keepAtCenter={true}
                />
                {dronePath.map((position, index) => (
                    <CircleMarker
                        key={index}
                        center={position}
                        fill={true}
                        color="#220bb9"
                        radius={3}>
                        <Popup>
                            <b>lat:</b> {position[0]} <br />
                            <b>lng:</b> {position[1]} <br />
                        </Popup>
                        A
                    </CircleMarker>
                ))}
                {dronePath.length >= 2 && position?.length === 2 && (
                    <DriftMarker
                        position={position}
                        duration={1000}
                        keepAtCenter={true}
                        icon={
                            new Icon({
                                iconUrl: droneIcon
                            })
                        }
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default Leaflet;
