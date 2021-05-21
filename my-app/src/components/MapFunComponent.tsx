import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
export interface IMapFunComponent {}
const MapFunComponent: React.SFC<IMapFunComponent> = () => {
  const [map, setMap] = useState(null);
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={[38.9471, -98.3534]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: 1000 }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    []
  );
  return <div>{displayMap}</div>;
};
/**
 * https://react-leaflet.js.org/docs/example-external-state
 */
