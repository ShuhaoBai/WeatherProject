import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class WeatherStationCard extends React.Component {
  render() {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography gutterBottom>Weather Station Name</Typography>
          <Typography variant="h5" component="h2">
            London
          </Typography>
          <Typography>05/01/2021</Typography>
          <Typography variant="body2" component="p">
            lat: 12.123
            <br />
            lng: 12.456
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    );
  }
}
export default WeatherStationCard;
