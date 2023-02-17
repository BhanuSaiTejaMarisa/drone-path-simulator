import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import DriftMarker from 'react-leaflet-drift-marker';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import 'react-leaflet-drift-marker/dist/index.css';
const DroneMap = ({ path }) => {
    const [position, setPosition] = useState(null);
    const [dronePath, setDronePath] = useState([]);

    useEffect(() => {
        setDronePath(path);
    }, [path]);

    useEffect(() => {
        let intervalId;
        let i = 0;
        const animate = () => {
            intervalId = setInterval(() => {
                setPosition(dronePath[i]);
                i++;
                if (i >= dronePath.length) {
                    i = 0;
                }
            }, 1000);
        };
        animate();

        return () => clearInterval(intervalId);
    }, [dronePath]);

    return (
        <MapContainer
            center={[17.385, 78.4867]}
            zoom={13}
            style={{ height: '500px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {position && (
                <Marker
                    position={position}
                    icon={new Icon({ iconUrl: icon, shadowUrl: iconShadow })}
                />
            )}
            {position && (
                <DriftMarker
                    position={position}
                    duration={10}
                    keepAtCenter={true}
                />
            )}
        </MapContainer>
    );
};

export default DroneMap;
