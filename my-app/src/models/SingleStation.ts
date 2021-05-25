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
  stationResults: ISingleStationResults[];
  constructor(data: { stationResults: ISingleStationResults[] }) {
    this.stationResults = data.stationResults;
  }
}
