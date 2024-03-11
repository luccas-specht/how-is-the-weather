const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro na requisição: ' + response.statusText);
  }
  return response.json();
};

const getLocationByCityInformed = async ({ city, APIKey }) => {
  const baseUrl = 'http://api.openweathermap.org/geo/1.0/direct?';
  const entireUrl = `${baseUrl}q=${city}&appid=${APIKey}`;

  try {
    return await fetchJSON(entireUrl);
  } catch (error) {
    console.error('Erro ao tentar fazer a requisição:', error);
    return null;
  }
};

const getPredictionsBasedOnLatAndLon = async ({ lat, lon, APIKey }) => {
  const defaultLangAsBrazilianPortuguese = 'pt_br';
  const defaultUnitsAsCelsius = 'metric';
  const maxAmountOfForecasts = 4;
  const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
  const entireUrl = `${baseUrl}lat=${lat}&lon=${lon}&appid=${APIKey}&lang=${defaultLangAsBrazilianPortuguese}&units=${defaultUnitsAsCelsius}&cnt=${maxAmountOfForecasts}`;

  try {
    const data = await fetchJSON(entireUrl);
    return data?.list;
  } catch (error) {
    console.error('Erro ao tentar fazer a requisição:', error);
    return null;
  }
};

const getUpcomingPredictions = async ({ city, APIKey }) => {
  const location = await getLocationByCityInformed({ city, APIKey });

  if (!location) {
    return null;
  }

  const { lat, lon } = location[0];

  return await getPredictionsBasedOnLatAndLon({ lat, lon, APIKey });
};

const mainCall = async () => {
  const city = document.getElementById('cityToSearch').value;
  const APIKey = 'b23965f99d8afde99c2e60db0753b5e8';

  const response = await getUpcomingPredictions({ city, APIKey });
  console.log({ response });
};

document.getElementById('buttonId').addEventListener('click', mainCall);
