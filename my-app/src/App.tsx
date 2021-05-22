import React from 'react';
import { fetchStations, fetchStationsWithinRange } from './api';
import MapComponent from './components/MapComponent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import WeatherStationTable from './components/WeatherStationTable';
import { IStationsResults } from './models/Stations';
import * as L from 'leaflet';
export interface IAppProps {}
export interface IAppState {
  results: IStationsResults[];
  lat_lo: string;
  lng_lo: string;
  lat_hi: string;
  lng_hi: string;
  boundsData: L.LatLngBounds[];
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: [],
      lat_lo: '',
      lng_lo: '',
      lat_hi: '',
      lng_hi: '',
      boundsData: [],
    };
  }

  async componentDidMount() {
    const fetchedStationsData = await fetchStations();
    if (fetchedStationsData) {
      this.setState({
        results: fetchedStationsData.results,
      });
    }
  }
  componentDidUpdate(
    prevProps: any,
    prevState: { boundsData: L.LatLngBounds[] }
  ) {
    if (prevState.boundsData !== this.state.boundsData) {
      this.handleZoomSearch();
    }
  }
  handleZoomSearch = () => {
    let southWest_lat = this.state.boundsData[0].getSouthWest().lat;
    let southWest_lng = this.state.boundsData[0].getSouthWest().lng;
    let northEast_lat = this.state.boundsData[0].getNorthEast().lat;
    let northEast_lng = this.state.boundsData[0].getNorthEast().lng;
    console.log('southWest_lat: ' + southWest_lat);
    console.log('southWest_lng: ' + southWest_lng);
    console.log('northEast_lat: ' + northEast_lat);
    console.log('northEast_lng: ' + northEast_lng);
  };

  handleClick = async () => {
    const fetchedStationsDataWithinRange = await fetchStationsWithinRange();
    if (fetchedStationsDataWithinRange) {
      this.setState({
        results: fetchedStationsDataWithinRange.results,
      });
    }
  };

  getRangedStationsData = async () => {
    const fetchedStationsDataWithinRange = await fetchStationsWithinRange();
    if (fetchedStationsDataWithinRange) {
      this.setState({
        results: fetchedStationsDataWithinRange.results,
      });
    }
  };

  getNewBoundsDataFromParent = (value: L.LatLngBounds[]) => {
    this.setState({
      boundsData: value,
    });
  };

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper>
              <WeatherStationTable results={this.state.results} />
            </Paper>
            <Button variant="contained" onClick={this.handleClick}>
              Search
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Paper>
              <MapComponent
                results={this.state.results}
                getRangedStationsData={this.getRangedStationsData}
                getNewBoundsDataFromParent={this.getNewBoundsDataFromParent}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default App;
