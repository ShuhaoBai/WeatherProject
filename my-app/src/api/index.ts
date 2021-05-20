import axios from 'axios';

const url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2';

const api_token = 'DyBSLXnRXiwfGgWmOaOVGAzPPrsuRqKa';

export const fetchData = async () => {
  try {
    const fetchedData = await axios.get(`${url}/stations/COOP:010008`, {
      headers: { token: `${api_token}` },
    });
    return fetchedData;
  } catch (error) {
    console.log(error);
  }
};
