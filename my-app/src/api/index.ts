import axios from 'axios';

const api_token = 'ipZdCjijQVoUPrAsXXOpPEumFeCNNVio';

export const fetchData = async () => {
  const url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2';
  try {
    const fetchedData = await axios.get(`${url}/stations/COOP:010008`, {
      headers: { token: api_token },
    });
    return fetchedData;
  } catch (error) {
    console.log(error);
  }
};

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

export const fetchStationsWithinRange = async () => {
  const lat_lo = '47.5204';
  const lng_lo = '-122.2047';
  const lat_hi = '47.6139';
  const lng_hi = '-122.1065';
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
