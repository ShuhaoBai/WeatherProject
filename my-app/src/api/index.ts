import axios from 'axios';
import moment, { Moment } from 'moment';
const api_token = 'ipZdCjijQVoUPrAsXXOpPEumFeCNNVio';

export const fetchStations = async () => {
  const url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations';
  try {
    const fetchedStationsData = await axios.get(`${url}`, {
      headers: { token: `${api_token}` },
    });
    const {
      data: { results },
    } = fetchedStationsData;
    return { results };
  } catch (error) {
    console.log(error);
  }
};

export const fetchSingleStation = async (stationId: string) => {
  const url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations';
  try {
    const fetchedSingleStationData = await axios.get(`${url}/${stationId}`, {
      headers: { token: `${api_token}` },
    });
    const { data } = fetchedSingleStationData;
    return { data };
  } catch (error) {
    console.log(error);
  }
};

export const fetchSingleStationYealySummaryWithStationId = async (
  selectedStationId: string,
  startDate: Moment,
  endDate: Moment
) => {
  const convertedStartDate = startDate.format().slice(0, 10);
  const convertedEndDate = endDate.format().slice(0, 10);
  const setUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=PRECIP_15&stationid=${selectedStationId}&units=metric&startdate=${convertedStartDate}&enddate=${convertedEndDate}`;
  try {
    const fetchedSingleStationYearlySummaryWithStationId = await axios.get(
      `${setUrl}`,
      {
        headers: { token: `${api_token}` },
      }
    );
    const {
      data: { results },
    } = fetchedSingleStationYearlySummaryWithStationId;
    return { results };
  } catch (error) {
    console.log(error);
  }
};

export const fetchStationsWithinRange = async (
  lat_lo: number,
  lng_lo: number,
  lat_hi: number,
  lng_hi: number
) => {
  const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?extent=${lat_lo},${lng_lo},${lat_hi},${lng_hi}`;
  try {
    const fetchedStationsData = await axios.get(`${url}`, {
      headers: { token: `${api_token}` },
    });
    const {
      data: { results },
    } = fetchedStationsData;
    return { results };
  } catch (error) {
    console.log(error);
  }
};
