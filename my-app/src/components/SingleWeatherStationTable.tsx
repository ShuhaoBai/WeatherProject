import React from 'react';
import moment, { Moment } from 'moment';
import {
  fetchSingleStation,
  fetchStationsWithinRange,
  fetchSingleStationYealySummaryWithStationId,
} from '../api';
import { IPrecipStationResults } from '../models/PrecipStation';

export interface ISingleWeatherStationTableProps {
  stationId: string;
  elevation: number;
  elevationUnit: string;
  id: string;
  latitude: string;
  longitude: string;
  maxdate: string;
  mindate: string;
  name: string;
  bufferStartDate?: Moment;
  bufferEndDate?: Moment;
}
export interface ISingleWeatherStationTableState {
  // elevation: number;
  // elevationUnit: string;
  // id: string;
  // latitude: number;
  // longitude: number;
  // maxdate: string;
  // mindate: string;
  // name: string;
  results: IPrecipStationResults[];
}

class SingleWeatherStationTable extends React.Component<
  ISingleWeatherStationTableProps,
  ISingleWeatherStationTableState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      results: [],
    };
  }
  // async componentDidMount() {
  //TODO - Replace fetchSingleStation with fetchYearly

  // await this.startFetchingSingleStationData(this.props.stationId);

  //TODO-fetchSingleStationYealySummaryWithStationId() should be inside componentDidUpdate()
  // if (this.props.bufferStartDate && this.props.bufferEndDate) {
  //   console.log(this.props.bufferStartDate);
  //   console.log(this.props.bufferStartDate);
  //   const fetchedSingleStationYealySummaryDataWithStationId =
  //     await fetchSingleStationYealySummaryWithStationId(
  //       this.props.stationId,
  //       this.props.bufferStartDate,
  //       this.props.bufferEndDate
  //     );
  //   console.log(fetchedSingleStationYealySummaryDataWithStationId);
  // }
  // }

  // startFetchingSingleStationData = async (stationId: string) => {
  //   const fetchedSingleStationData = await fetchSingleStation(stationId);
  //   if (fetchedSingleStationData) {
  //     this.setState({
  //       elevation: fetchedSingleStationData.data.elevation,
  //       elevationUnit: fetchedSingleStationData.data.elevationUnit,
  //       id: fetchedSingleStationData.data.id,
  //       latitude: fetchedSingleStationData.data.latitude,
  //       longitude: fetchedSingleStationData.data.longitude,
  //       maxdate: fetchedSingleStationData.data.maxdate,
  //       mindate: fetchedSingleStationData.data.mindate,
  //       name: fetchedSingleStationData.data.name,
  //     });
  //   }
  // };
  startFetchingSingleStationYearlySummaryWithStationId = async (
    stationId: string,
    bufferStartDate: Moment,
    bufferEndDate: Moment
  ) => {
    if (this.props.bufferStartDate && this.props.bufferEndDate) {
      const fetchedSingleStationYealySummaryDataWithStationId =
        await fetchSingleStationYealySummaryWithStationId(
          this.props.stationId,
          this.props.bufferStartDate,
          this.props.bufferEndDate
        );
      console.log(fetchedSingleStationYealySummaryDataWithStationId);
    }
  };

  async componentDidUpdate(
    prevProps: {
      stationId: string;
      bufferStartDate?: Moment;
      bufferEndDate?: Moment;
    },
    prevState: any
  ) {
    if (
      prevProps.bufferStartDate !== this.props.bufferStartDate &&
      prevProps.bufferEndDate !== this.props.bufferEndDate
    ) {
      if (this.props.bufferStartDate && this.props.bufferEndDate) {
        await this.startFetchingSingleStationYearlySummaryWithStationId(
          this.props.stationId,
          this.props.bufferStartDate,
          this.props.bufferEndDate
        );
      }
      // console.log('inside componentDidUpdate()');
    }
  }

  render() {
    return (
      <div>
        <h1>{this.props.stationId}</h1>
        <h1>
          {this.props.elevation}
          {this.props.elevationUnit}
        </h1>
        <h1>{this.props.id}</h1>
        <h1>{this.props.latitude}</h1>
        <h1>{this.props.longitude}</h1>
        <h1>{this.props.maxdate}</h1>
        <h1>{this.props.mindate}</h1>
        <h1>{this.props.name}</h1>
      </div>
    );
  }
}
export default SingleWeatherStationTable;
