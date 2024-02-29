const checkIsAValidCity = ({ city }) => {
  if (city.trim() === '') {
    // toast
    console.error('Por favor, digite o nome da city.');
    return;
  }
};

const getUpcomingPredictions = async ({ city, APIKey }) => {
  /* To be able to get the upcoming predictions based in the city informed, it must be call by sending lat and long as params.
     However there is not a way to get lat and long from city without do this request before: http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}*/

  const getLocationByCityInformed = async () => {
    const baseUrl = 'http://api.openweathermap.org/geo/1.0/direct?';
    const entireUrl = `${baseUrl}q=${city}&appid=${APIKey}`;

    return await fetch(entireUrl)
      .then((response) => {
        if (!response.ok)
          throw new Error('Erro na requisição: ' + response.statusText);

        return response.json();
      })
      .catch((error) => {
        // tratar erros
        console.error('Erro ao tentar fazer a requisição:', error);
      });
  };

  const getPredictionsBasedOnLatAndLon = async ({ lat, lon }) => {
    const defaultLangAsBrazilianPortuguese = 'pt_br';
    const defaultUnitsAsCelsius = 'metric';
    const maxAmountOfForecasts = 4;
    const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?';

    const entireUrl = `${baseUrl}lat=${lat}&lon=${lon}&appid=${APIKey}&lang=${defaultLangAsBrazilianPortuguese}&units=${defaultUnitsAsCelsius}&cnt=${maxAmountOfForecasts}`;

    return fetch(entireUrl)
      .then((response) => {
        if (!response.ok)
          throw new Error('Erro na requisição: ' + response.statusText);

        return response.json();
      })
      .then((data) => {
        return data?.list;
      })
      .catch((error) => {
        console.error('Erro ao tentar fazer a requisição:', error);
      });
  };

  const [firstFound, ...rest] = await getLocationByCityInformed();
  const { lat, lon } = firstFound;

  return await getPredictionsBasedOnLatAndLon({ lat, lon });
};

const mainFunctionToCheckTheWeather = async () => {
  // get the input value by id
  const city = document.getElementById('cityToSearch').value;
  const appId = 'b23965f99d8afde99c2e60db0753b5e8';

  checkIsAValidCity({ city });
  const opa = await getUpcomingPredictions({ city, APIKey: appId });

  console.log({ opa });
};

// Adicionando um evento de clique ao botão
document
  .getElementById('buttonId')
  .addEventListener('click', mainFunctionToCheckTheWeather);
