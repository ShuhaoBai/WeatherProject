import React from 'react';
import { fetchData } from './api';
import Map from './components/Map';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import WeatherStationCard from './components/WeatherStationCard';
import DatePickerComponent from './components/DatePickerComponent';

class App extends React.Component {
  // state = {
  //   data: {},
  // };

  async componentDidMount() {
    const fetchedData = await fetchData();
    console.log(fetchedData);
  }

  render() {
    // const { data } = this.state;
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper>
              <WeatherStationCard />
            </Paper>
            <Paper>
              <DatePickerComponent />
            </Paper>
          </Grid>

          <Grid item xs={8}>
            <Paper>
              <Map />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default App;
