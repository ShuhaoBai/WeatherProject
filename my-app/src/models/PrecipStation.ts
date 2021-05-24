export interface IPrecipStationResults {
  date: string;
  datatype: string;
  station: string;
  attributes: string;
  value: number;
}

export default class PrecipStation {
  stationsResults: IPrecipStationResults[];
  constructor(data: { stationsResults: IPrecipStationResults[] }) {
    this.stationsResults = data.stationsResults;
  }
}
