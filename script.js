const checkIsAValidCity = ({ city }) => {
  console.log({ city });
  if (city.trim() === '') {
    // toast
    console.error('Por favor, digite o nome da city.');
    return;
  }
};

const getWeather = async ({ city, APIKey }) => {
  const getLocationByCityInformed = async () => {
    var baseUrl = 'http://api.openweathermap.org/geo/1.0/direct?';
    var entireUrl = `${baseUrl}q=${city}&appid=${APIKey}`;

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

  const getWeatherFromLatAndLon = async ({ lat, lon }) => {
    var defaultLang = 'pt_br';
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&lang=${defaultLang}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error('Erro na requisição: ' + response.statusText);

        return response.json();
      })
      .then((data) => {
        console.log({ data });
      })
      .catch((error) => {
        console.error('Erro ao tentar fazer a requisição:', error);
      });
  };

  const [firstFound, ...rest] = await getLocationByCityInformed();
  const { lat, lon } = firstFound;

  await getWeatherFromLatAndLon({ lat, lon });
};

function mainFunctionToCheckTheWeather() {
  var city = document.getElementById('cityToSearch').value;
  var appId = 'b23965f99d8afde99c2e60db0753b5e8';

  checkIsAValidCity({ city });
  getWeather({ city, APIKey: appId });
}

// Adicionando um evento de clique ao botão
document
  .getElementById('buttonId')
  .addEventListener('click', mainFunctionToCheckTheWeather);
