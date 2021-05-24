import React from 'react';
import {
  fetchStations,
  fetchStationsWithinRange,
  fetchSingleStation,
} from './api';
import MapComponent from './components/MapComponent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WeatherStationTable from './components/WeatherStationTable';
import SingleWeatherStationTable from './components/SingleWeatherStationTable';
import DatePicker, {
  DateRange,
} from './components/date-picker-airbnb/DatePicker';
import TestingDisplay from './components/date-picker-airbnb/TestingDisplay';
import moment, { Moment } from 'moment';
import { IStationsResults } from './models/Stations';
import * as L from 'leaflet';
import { Button } from '@material-ui/core';

export interface IAppProps {}
export interface IAppState {
  results: IStationsResults[];
  boundsData: L.LatLngBounds[];
  selectedStationId: string;
  //----single station data
  elevation: number;
  elevationUnit: string;
  id: string;
  latitude: string;
  longitude: string;
  maxdate: string;
  mindate: string;
  name: string;
  //----selected Date Range from <DatePicker />
  startDate?: Moment;
  endDate?: Moment;
  //----combined date range
  newDateRange: DateRange | null;
  //----year search buffer parameters
  bufferStartDate?: Moment;
  bufferEndDate?: Moment;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: [],
      boundsData: [],
      selectedStationId: '',
      elevation: 0,
      elevationUnit: '',
      id: '',
      latitude: '',
      longitude: '',
      maxdate: '',
      mindate: '',
      name: '',
      //selected date range
      startDate: undefined,
      endDate: undefined,
      //combined date range
      newDateRange: null,
      //yearly search parameter buffer
      bufferStartDate: undefined,
      bufferEndDate: undefined,
    };
  }

  //Fetch fixed 25 stations when App first time loaded.
  async componentDidMount() {
    const fetchedStationsData = await fetchStations();
    if (fetchedStationsData) {
      this.setState({
        results: fetchedStationsData.results,
      });
    }
  }

  //Auto-searching when users pan/zoom map
  componentDidUpdate(
    prevProps: any,
    prevState: { boundsData: L.LatLngBounds[] }
  ) {
    if (prevState.boundsData !== this.state.boundsData) {
      this.handleZoomSearch();
    }
  }
  handleZoomSearch = () => {
    let southWest_lat = +this.state.boundsData[0].getSouthWest().lat.toFixed(4);
    let southWest_lng = +this.state.boundsData[0].getSouthWest().lng.toFixed(4);
    let northEast_lat = +this.state.boundsData[0].getNorthEast().lat.toFixed(4);
    let northEast_lng = +this.state.boundsData[0].getNorthEast().lng.toFixed(4);
    this.getRangedStationsData(
      southWest_lat,
      southWest_lng,
      northEast_lat,
      northEast_lng
    );
  };

  getRangedStationsData = async (
    southWest_lat: number,
    southWest_lng: number,
    northEast_lat: number,
    northEast_lng: number
  ) => {
    const fetchedStationsDataWithinRange = await fetchStationsWithinRange(
      southWest_lat,
      southWest_lng,
      northEast_lat,
      northEast_lng
    );
    if (fetchedStationsDataWithinRange) {
      this.setState({
        results: fetchedStationsDataWithinRange.results,
      });
    }
  };
  //Get new bounds corner data when users pan/zoom the map, from <MapComponent />
  getNewBoundsDataFromParent = (value: L.LatLngBounds[]) => {
    this.setState({
      boundsData: value,
    });
  };

  //Get one single station id from WeatherStationTable, by clicking on a table row
  getSelectedStationId = (selectedStationId: string) => {
    // console selected station's id
    console.log(selectedStationId);
    this.startFetchingSingleStationData(selectedStationId);
  };

  //Tessting -- Get one specific weather station data with selectedStationId from the table
  //and pass fetched data to <SingleWeatherStationTable />
  //TODO - will remove this method, and render single table with selected date range
  startFetchingSingleStationData = async (selectedStationId: string) => {
    const fetchedSingleStationData = await fetchSingleStation(
      selectedStationId
    );
    console.log(fetchedSingleStationData);
    if (fetchedSingleStationData) {
      this.setState({
        elevation: fetchedSingleStationData.data.elevation,
        elevationUnit: fetchedSingleStationData.data.elevationUnit,
        id: fetchedSingleStationData.data.id,
        latitude: fetchedSingleStationData.data.latitude,
        longitude: fetchedSingleStationData.data.longitude,
        maxdate: fetchedSingleStationData.data.maxdate,
        mindate: fetchedSingleStationData.data.mindate,
        name: fetchedSingleStationData.data.name,
      });
    }
  };

  //TODO - implement the function of manully select date range from DatePicker - done
  //TODO - ability to select datasetid and units, then fetch yearly data

  getSelectednewStartDate = (newStartDate: Moment) => {
    this.setState(
      {
        startDate: newStartDate,
      },
      () => console.log(this.state.startDate)
    );
  };
  getSelectednewEndDate = (newEndDate: Moment) => {
    this.setState(
      {
        endDate: newEndDate,
      },
      () => console.log(this.state.endDate)
    );
  };
  onClickSubmit = () => {
    this.setState(
      {
        bufferStartDate: this.state.startDate,
        bufferEndDate: this.state.endDate,
      },
      () =>
        console.log(
          //TODO - need to find better way to format moment
          this.state.bufferStartDate?.format().slice(0, 10),
          this.state.bufferEndDate?.format().slice(0, 10)
        )
    );
  };

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper>
              <WeatherStationTable
                results={this.state.results}
                getSelectedStationId={this.getSelectedStationId}
              />
            </Paper>
            <Paper>
              <SingleWeatherStationTable
                stationId={this.state.selectedStationId}
                elevation={this.state.elevation}
                elevationUnit={this.state.elevationUnit}
                id={this.state.id}
                latitude={this.state.latitude}
                longitude={this.state.longitude}
                maxdate={this.state.maxdate}
                mindate={this.state.mindate}
                name={this.state.name}
                bufferStartDate={this.state.bufferStartDate}
                bufferEndDate={this.state.bufferEndDate}
              />
            </Paper>
            <Paper>
              <DatePicker
                getSelectednewStartDate={this.getSelectednewStartDate}
                getSelectednewEndDate={this.getSelectednewEndDate}
              />
              <Button onClick={this.onClickSubmit}>Search</Button>
            </Paper>
          </Grid>
          <Paper>
            <TestingDisplay
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
          </Paper>

          <Grid item xs={8}>
            <Paper>
              <MapComponent
                results={this.state.results}
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
