import { LeafletEvent, Map } from 'leaflet';
import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { IStationsResults } from '../models/Stations';
export interface IMapComponentProps {
  results: IStationsResults[];
  getRangedStationsData: () => void;
}
class MapComponent extends React.Component<IMapComponentProps> {
  mapRef: React.RefObject<unknown>;
  constructor(props: IMapComponentProps | Readonly<IMapComponentProps>) {
    super(props);
    this.mapRef = React.createRef();
  }
  handleMoveEnd = () => {
    console.log('map moved!');
  };
  // grabBounds() {
  //   let lat_lo;
  //   let lng_lo;
  //   let lat_hi;
  //   let lng_hi;
  //   let currBounds = Map.getBounds();
  //   lat_lo = currBounds.getSouthWest().lat;
  //   lng_lo = currBounds.getSouthWest().lng;
  //   lat_hi = currBounds.getNorthEast().lat;
  //   lng_hi = currBounds.getNorthEast().lng;
  //   console.log(lat_lo, lng_lo, lat_hi, lng_hi);
  // }

  render() {
    const { results, getRangedStationsData } = this.props;

    return (
      <MapContainer
        center={[38.9471, -98.3534]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: 1000 }}
        whenCreated={(map) => {
          map.on('moveend', () => {
            let lat_lo;
            let lng_lo;
            let lat_hi;
            let lng_hi;
            let currBounds = map.getBounds();
            lat_lo = currBounds.getSouthWest().lat;
            lng_lo = currBounds.getSouthWest().lng;
            lat_hi = currBounds.getNorthEast().lat;
            lng_hi = currBounds.getNorthEast().lng;
            console.log(lat_lo, lng_lo, lat_hi, lng_hi);
          });
          map.on('click', () => {
            console.log('clicked as well');
          });
        }}
        // whenCreated={(mapInstance) => {
        //   this.mapRef.current = mapInstance;
        // }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {results.map((result) => (
          <Marker
            position={[result.latitude, result.longitude]}
            key={result.id}
          >
            <Popup>
              <span>Station Name: {result.name}</span>
              <br />
              <span>
                Elevation: {result.elevation} {result.elevationUnit}
              </span>
              <br />
              <span>Latitude: {result.latitude}</span>
              <br />
              <span>Longitude: {result.longitude}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
}
export default MapComponent;
