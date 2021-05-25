export interface IStationsResultSet {
  offset: number;
  count: number;
  limit: number;
}

export interface IStationsMetadata {
  resultset: IStationsResultSet;
}

export interface IStationsResults {
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

export default class Stations {
  stationsMetadata: IStationsMetadata;
  stationsResults: IStationsResults[];

  constructor(data: {
    stationsMetadata: IStationsMetadata;
    stationsResults: IStationsResults[];
  }) {
    this.stationsMetadata = data.stationsMetadata;
    this.stationsResults = data.stationsResults;
  }
}
