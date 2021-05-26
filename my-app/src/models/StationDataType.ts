export interface IStationDataTypeResults {
  mindate: string;
  maxdate: string;
  name: string;
  datacoverage: number;
  id: string;
}

export default class StationDataType {
  stationDataTypeResults: IStationDataTypeResults[];
  constructor(data: { stationDataTypeResults: IStationDataTypeResults[] }) {
    this.stationDataTypeResults = data.stationDataTypeResults;
  }
}
