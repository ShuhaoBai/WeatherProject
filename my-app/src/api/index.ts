import axios from 'axios';

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

export const fetchSingleStationYealySummary = async (
  selectedStationId: string
) => {
  const setUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=PRECIP_15&stationid=${selectedStationId}&units=metric&startdate=2012-05-01&enddate=2012-05-31`;
  try {
    const fetchedSingleStationYearlySummary = await axios.get(`${setUrl}`, {
      headers: { token: `${api_token}` },
    });
    const {
      data: { results },
    } = fetchedSingleStationYearlySummary;
    // console.log(fetchedSingleStationYearlySummary);
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

export const fetchStationsWithinFixedDateRange = async () => {
  //Test - fixed date code
  const startdate = '2010-01-01';
  const enddate = '2012-01-01';
  // const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?startdate=${startdate}&enddate=${enddate}`;
  const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?startdate=${startdate}`;
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
