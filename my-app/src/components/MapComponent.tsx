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
  saveBounds: (num: L.LatLngBounds[]) => void;
}
function GrabBounds({ saveBounds }: IGrabBoundsProps) {
  useMapEvents({
    moveend: (e) => {
      const bd = e.target.getBounds();
      let corner1 = bd._southWest;
      let corner2 = bd._northEast;
      let newBoundsReturn = [new L.LatLngBounds(corner1, corner2)];
      saveBounds(newBoundsReturn);
    },
  });
  return null;
}

export interface IMapComponentProps {
  results: IStationsResults[];
  getNewBoundsDataFromMap: (val: L.LatLngBounds[]) => void;
}
export interface IMapComponentState {
  boundsData: L.LatLngBounds[];
}
class MapComponent extends React.Component<
  IMapComponentProps,
  IMapComponentState
> {
  constructor(props: IMapComponentProps) {
    super(props);
    this.state = {
      boundsData: [],
    };
  }
  saveBoundsMethod = (newBoundCoords: L.LatLngBounds[]) => {
    this.setState({
      boundsData: newBoundCoords,
    });
  };
  componentDidUpdate(
    prevProps: any,
    prevState: { boundsData: L.LatLngBounds[] }
  ) {
    if (
      prevState.boundsData.length !== 0 &&
      this.state.boundsData.length !== 0 &&
      prevState.boundsData[0].getNorthEast() !==
        this.state.boundsData[0].getNorthEast() &&
      prevState.boundsData[0].getSouthWest() !==
        this.state.boundsData[0].getSouthWest()
    ) {
      this.setState({
        boundsData: this.state.boundsData,
      });
      this.sendOutNewBoundsData();
    }
  }

  sendOutNewBoundsData = () => {
    if (this.state.boundsData) {
      this.props.getNewBoundsDataFromMap(this.state.boundsData);
    }
  };

  render() {
    const { results } = this.props;
    return (
      <MapContainer
        center={[31.5702, -85.2482]}
        zoom={6}
        maxZoom={12}
        scrollWheelZoom={false}
        style={{ height: 1100, width: 'auto' }}
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
            <Popup autoPan={false}>
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
