import React from 'react';
import * as L from 'leaflet';
import {
  fetchStations,
  fetchStationsWithinRange,
  fetchSingleStationYealySummaryWithStationId,
} from './api';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { Moment } from 'moment';
import { IStationsResults } from './models/Stations';
import { IPrecipStationResults } from './models/PrecipStation';
import { IStationDataTypeResults } from './models/StationDataType';
import SimpleList from './components/list/SimpleList';
import WeatherStationTable from './components/WeatherStationTable';
import NewSingleTable from './components/NewSingleTable';
import DatePicker from './components/date-picker-airbnb/DatePicker';
import MapComponent from './components/MapComponent';

export interface IAppProps {}
export interface IAppState {
  results: IStationsResults[];
  boundsData: L.LatLngBounds[];
  selectedStationId: string;
  selectedStationName: string;
  bufferStartDate?: Moment;
  bufferEndDate?: Moment;
  singleTableResults: IPrecipStationResults[];
  avaiableDataTypeResults: IStationDataTypeResults[];
  newestAllowed?: Moment;
  oldestAllowed?: Moment;
  menuItemValue: string;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: [],
      singleTableResults: [],
      avaiableDataTypeResults: [],
      boundsData: [],
      selectedStationId: '',
      selectedStationName: '',
      menuItemValue: '',
      bufferStartDate: undefined,
      bufferEndDate: undefined,
      newestAllowed: undefined,
      oldestAllowed: undefined,
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
  getNewBoundsDataFromMap = (value: L.LatLngBounds[]) => {
    this.setState({
      boundsData: value,
    });
  };

  //Get one single station id from WeatherStationTable, by clicking on a table row
  getSelectedStationIdAndName = (
    selectedStationId: string,
    selectedStationName: string
  ) => {
    this.setState({
      selectedStationId: selectedStationId,
      selectedStationName: selectedStationName,
    });
  };

  getSelectednewStartDate = (newStartDate: Moment) => {
    this.setState({
      bufferStartDate: newStartDate,
    });
  };
  getSelectednewEndDate = (newEndDate: Moment) => {
    this.setState({
      bufferEndDate: newEndDate,
    });
  };

  getStationDateRange = (
    newestAllowed: Moment | undefined,
    oldestAllowed: Moment | undefined
  ) => {
    this.setState({
      newestAllowed: newestAllowed,
      oldestAllowed: oldestAllowed,
    });
  };

  // After clicking search button, fetch data with stationId, bufferDates, dataType
  onClickSubmit = async () => {
    if (
      this.state.bufferStartDate &&
      this.state.bufferEndDate &&
      this.state.selectedStationId &&
      this.state.menuItemValue
    ) {
      await this.startFetchingSingleStationYearlySummaryWithStationId(
        this.state.selectedStationId,
        this.state.bufferStartDate,
        this.state.bufferEndDate,
        this.state.menuItemValue
      );
    }
  };

  startFetchingSingleStationYearlySummaryWithStationId = async (
    stationId: string,
    bufferStartDate: Moment,
    bufferEndDate: Moment,
    menuItemValue: string
  ) => {
    const fetchedSingleStationYealySummaryDataWithStationId =
      await fetchSingleStationYealySummaryWithStationId(
        stationId,
        bufferStartDate,
        bufferEndDate,
        menuItemValue
      );
    if (fetchedSingleStationYealySummaryDataWithStationId) {
      this.setState({
        singleTableResults:
          fetchedSingleStationYealySummaryDataWithStationId.results,
      });
    }
  };

  getNextOrPreviousPageStationData = (nextPageResults: IStationsResults[]) => {
    this.setState({
      results: nextPageResults,
    });
  };
  getStationAvailableDataType = (
    avaiableDataTypeResults: IStationDataTypeResults[]
  ) => {
    this.setState({
      avaiableDataTypeResults: avaiableDataTypeResults,
    });
  };
  getMenuItemValue = (menuItemValue: string) => {
    this.setState({
      menuItemValue: menuItemValue,
    });
  };

  render() {
    let dataSetIdList;
    let newSingleTable;
    let searchButton;

    if (!this.state.selectedStationName) {
      dataSetIdList = null;
    } else if (
      this.state.avaiableDataTypeResults &&
      this.state.avaiableDataTypeResults.length > 0
    ) {
      dataSetIdList = (
        <SimpleList
          avaiableDataTypeResults={this.state.avaiableDataTypeResults}
          getMenuItemValue={(menuItemValue) =>
            this.getMenuItemValue(menuItemValue)
          }
        />
      );
    } else {
      dataSetIdList = (
        <div>
          <span>No Dataset ID available for this station</span>
        </div>
      );
    }

    if (
      !this.state.selectedStationName ||
      !this.state.singleTableResults ||
      !this.state.avaiableDataTypeResults
    ) {
      newSingleTable = null;
    } else if (
      this.state.singleTableResults &&
      this.state.singleTableResults.length > 0
    ) {
      newSingleTable = (
        <NewSingleTable singleTableResults={this.state.singleTableResults} />
      );
    } else if (
      this.state.selectedStationName &&
      !this.state.avaiableDataTypeResults
    ) {
      newSingleTable = (
        <div>
          <h1>No Data Available</h1>
        </div>
      );
    }

    if (
      !this.state.selectedStationName ||
      !this.state.avaiableDataTypeResults
    ) {
      searchButton = null;
    } else {
      searchButton = (
        <Grid item xs={4}>
          <Button variant="contained" onClick={this.onClickSubmit}>
            Search
          </Button>
        </Grid>
      );
    }
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper variant="outlined">
              <WeatherStationTable
                results={this.state.results}
                getSelectedStationIdAndName={(
                  selectedStationId,
                  selectedStationName
                ) =>
                  this.getSelectedStationIdAndName(
                    selectedStationId,
                    selectedStationName
                  )
                }
                getStationDateRange={(newestAllowed, oldestAllowed) =>
                  this.getStationDateRange(newestAllowed, oldestAllowed)
                }
                getNextOrPreviousPageStationData={(nextPageResults) =>
                  this.getNextOrPreviousPageStationData(nextPageResults)
                }
                getStationAvailableDataType={(avaiableDataTypeResults) =>
                  this.getStationAvailableDataType(avaiableDataTypeResults)
                }
              />
            </Paper>
            <Paper variant="outlined">
              {this.state.selectedStationName ? (
                <div>
                  <h3>Selected Station Name</h3>
                  <h2>{this.state.selectedStationName}</h2>
                </div>
              ) : (
                <h3>Please select a station from above table.</h3>
              )}
            </Paper>
            <Paper variant="outlined">{dataSetIdList}</Paper>
            {this.state.avaiableDataTypeResults && (
              <Grid container spacing={6}>
                <Grid item xs={6}>
                  <DatePicker
                    getSelectednewStartDate={(newStartDate) =>
                      this.getSelectednewStartDate(newStartDate)
                    }
                    getSelectednewEndDate={(newEndDate) =>
                      this.getSelectednewEndDate(newEndDate)
                    }
                    oldestAllowed={this.state.oldestAllowed}
                    newestAllowed={this.state.newestAllowed}
                  />
                </Grid>
              </Grid>
            )}
            <Paper variant="outlined">{newSingleTable}</Paper>
            {searchButton}
          </Grid>
          <Grid item xs={8}>
            <Paper variant="outlined">
              <MapComponent
                results={this.state.results}
                getNewBoundsDataFromMap={(value) =>
                  this.getNewBoundsDataFromMap(value)
                }
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default App;
