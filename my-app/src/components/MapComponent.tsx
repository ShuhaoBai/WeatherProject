import React from 'react';
import * as L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { IStationsResults } from '../models/Stations';

interface IGrabBoundsProps {
  saveBounds: (num: number[]) => void;
}
function GrabBounds({ saveBounds }: IGrabBoundsProps) {
  useMapEvents({
    moveend: (e) => {
      const bd = e.target.getBounds();
      console.log('raw new bounds data');
      console.log(bd);
      const { _southWest, _northEast } = bd;
      console.log(_southWest.lat, _southWest.lng);
      console.log(_northEast.lat, _northEast.lng);
      let corner1 = [];
      let corner2 = [];
      corner1 = _southWest;

      corner2 = _northEast;
      console.log('[corner1,corner2]' + [corner1, corner2]);
      let newBoundsReturn = [corner1, corner2];
      console.log('newBoundsReturn: ' + newBoundsReturn);
      saveBounds(newBoundsReturn);
    },
  });
  return null;
}

export interface IMapComponentProps {
  results: IStationsResults[];
  getRangedStationsData: () => void;
}
export interface IMapComponentState {
  boundsData: L.LatLngBounds[];
}
class MapComponent extends React.Component<
  IMapComponentProps,
  IMapComponentState
> {
  constructor(props: IMapComponentProps | Readonly<IMapComponentProps>) {
    super(props);
    this.state = {
      boundsData: [],
    };
  }
  handleMoveEnd = () => {
    console.log('map moved!');
  };
  saveBoundsMethod = (newBoundCoords: any) => {
    console.log(newBoundCoords); //[LatLng, LatLng]
    console.log(newBoundCoords[0]); //[LatLng, LatLng]
    console.log(newBoundCoords[1]); //[LatLng, LatLng]
    const boundsData = [...this.state.boundsData, newBoundCoords];
    this.setState((prevState) => ({ ...prevState, boundsData }));
    console.log('print out state boundsData: ' + this.state.boundsData);
  };

  render() {
    const { results, getRangedStationsData } = this.props;

    return (
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
        <GrabBounds saveBounds={this.saveBoundsMethod} />
      </MapContainer>
    );
  }
}
export default MapComponent;
