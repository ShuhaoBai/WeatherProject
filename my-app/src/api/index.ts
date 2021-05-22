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
