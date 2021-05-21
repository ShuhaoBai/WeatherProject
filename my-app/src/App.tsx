import React from 'react';
import { fetchStations, fetchStationsWithinRange } from './api';
import MapComponent from './components/MapComponent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import WeatherStationTable from './components/WeatherStationTable';
import { IStationsResults } from './models/Stations';

export interface IAppProps {}
export interface IAppState {
  results: IStationsResults[];
  lat_lo: string;
  lng_lo: string;
  lat_hi: string;
  lng_hi: string;
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
    };
  }

  async componentDidMount() {
    const fetchedStationsData = await fetchStations();
    if (fetchedStationsData) {
      this.setState({
        results: fetchedStationsData.results,
      });
      console.log(fetchedStationsData.results);
    }
  }

  handleClick = async () => {
    const fetchedStationsDataWithinRange = await fetchStationsWithinRange();
    if (fetchedStationsDataWithinRange) {
      this.setState({
        results: fetchedStationsDataWithinRange.results,
      });
      console.log(fetchedStationsDataWithinRange.results);
    }
  };

  getRangedStationsData = async () => {
    const fetchedStationsDataWithinRange = await fetchStationsWithinRange();
    if (fetchedStationsDataWithinRange) {
      this.setState({
        results: fetchedStationsDataWithinRange.results,
      });
      console.log(fetchedStationsDataWithinRange.results);
    }
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
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default App;
