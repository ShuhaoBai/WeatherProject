import axios from 'axios';
import moment, { Moment } from 'moment';
import { API_TOKEN } from '../config/api-config';
const api_token = API_TOKEN;

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

// Fetch available data type for the selected station
export const fetchSingleStationAvailableDataType = async (
  selectedStationId: string
) => {
  const setUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets?stationid=${selectedStationId}`;
  try {
    const fetchedStationsData = await axios.get(`${setUrl}`, {
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

export const fetchSingleStationYealySummaryWithStationId = async (
  selectedStationId: string,
  startDate: Moment,
  endDate: Moment,
  dataSetId: string
) => {
  const convertedStartDate = startDate.format().slice(0, 10);
  const convertedEndDate = endDate.format().slice(0, 10);
  const setUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=${dataSetId}&stationid=${selectedStationId}&units=standard&startdate=${convertedStartDate}&enddate=${convertedEndDate}`;
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

export const fetchStationDateRange = async (stationId: string) => {
  const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations/${stationId}`;
  try {
    const fetchedStationDateRangeData = await axios.get(`${url}`, {
      headers: { token: `${api_token}` },
    });
    const {
      data: { mindate, maxdate },
    } = fetchedStationDateRangeData;
    const convertedMinDate = moment(maxdate);
    const convertedMaxDate = moment(mindate);
    return { convertedMinDate, convertedMaxDate };
  } catch (error) {
    console.log(error);
  }
};

export const fetchNextOrPreviousPageStation = async (
  offset: number,
  southWest_lat?: number,
  southWest_lng?: number,
  northEast_lat?: number,
  northEast_lng?: number
) => {
  if (southWest_lat) {
    const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?extent=${southWest_lat},${southWest_lng},${northEast_lat},${northEast_lng}&offset=${offset}`;
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
  } else {
    const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?offset=${offset}`;
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
  }
};
