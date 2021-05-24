// export interface ISingleStationResultSet {
//   offset: number;
//   count: number;
//   limit: number;
// }

// export interface ISingleStationMetadata {
//   resultset: ISingleStationResultSet;
// }

//TODO - set data type, and use them
export interface ISingleStationResults {
  elevation: number;
  mindate: string;
  maxdate: string;
  latitude: number;
  name: string;
  datacoverage: number;
  id: string;
  elevationUnit: string;
  longitude: number;
}

export default class SingleStation {
  // stationsMetadata: ISingleStationsMetadata;
  stationResults: ISingleStationResults[];

  // data is the "stations" json segment
  constructor(data: {
    // stationsMetadata: ISingleStationsMetadata;
    stationResults: ISingleStationResults[];
  }) {
    // this.stationsMetadata = data.stationsMetadata;
    this.stationResults = data.stationResults;
  }
}
