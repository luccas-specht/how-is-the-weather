function formatarTimestampToDateNow(timestamp) {
  var date = new Date(timestamp * 1000);

  var diasSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];
  var diaSemana = diasSemana[date.getDay()];

  var meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  var mes = meses[date.getMonth()];

  var dia = date.getDate();

  var dataFormatada = diaSemana + '. ' + dia + ' de ' + mes;

  return dataFormatada;
}

function calcularVelocidadeVento(infoVento) {
  var velocidadeMps = infoVento.speed; // velocidade em metros por segundo
  var direcaoGraus = infoVento.deg; // direção em graus

  // Converter a direção de graus para radianos
  var direcaoRadianos = direcaoGraus * (Math.PI / 180);

  // Calcular a velocidade do vento em km/h usando a fórmula dos componentes do vetor de vento
  var velocidadeKmh = velocidadeMps * (3600 / 1000); // converter de m/s para km/h

  return velocidadeKmh.toFixed(0) + 'km/h';
}

function formatarTimestampToHour(timestamp) {
  var date = new Date(timestamp * 1000);

  var hora = ('0' + date.getHours()).slice(-2);
  var minuto = ('0' + date.getMinutes()).slice(-2);

  var dataFormatada = hora + ':' + minuto;

  return dataFormatada;
}

// Exemplo de uso:
var timestamp = 1710248508;
var dataFormatada = formatarTimestampToDateNow(timestamp);
console.log(dataFormatada); // Saída: "ter. 12 mar. 10:09"

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

const getCurrentWeather = async ({ city, APIKey }) => {
  const defaultLangAsBrazilianPortuguese = 'pt_br';
  const defaultUnitsAsCelsius = 'metric';
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';

  const location = await getLocationByCityInformed({ city, APIKey });

  if (!location) {
    return null;
  }

  const { lat, lon } = location[0];

  try {
    const entireUrl =
      baseUrl +
      `lat=${lat}&lon=${lon}&appid=${APIKey}&lang=${defaultLangAsBrazilianPortuguese}&units=${defaultUnitsAsCelsius}`;
    return await fetchJSON(entireUrl);
  } catch (error) {
    console.error('Erro ao tentar fazer a requisição:', error);
    return null;
  }
};

// add HTML code
const mainCall = async () => {
  var container = document.getElementById('weatherContainer');

  var currentWeatherContainer = document.getElementById(
    'currentWeatherContainer'
  );

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  while (currentWeatherContainer.firstChild) {
    currentWeatherContainer.removeChild(currentWeatherContainer.firstChild);
  }

  const city = document.getElementById('cityToSearch').value;
  const APIKey = 'b23965f99d8afde99c2e60db0753b5e8';

  const response = await getUpcomingPredictions({ city, APIKey });

  const predictions = response.map((element) => ({
    time: element.dt_txt,
    weather: element.weather[0],
    temp_max: element.main.temp_max,
    temp_min: element.main.temp_min,
  }));

  const currentWeather = await getCurrentWeather({ APIKey, city });

  var weatherContainer = document.getElementById('weatherContainer');
  var currentWeatherContainer = document.getElementById(
    'currentWeatherContainer'
  );

  var sectionCard = document.createElement('section');
  sectionCard.classList.add('wrapper__main-content__current-weather__city');

  var cityName = document.createElement('h3');
  cityName.textContent = `${currentWeather.name}, ${currentWeather.sys.country} `;
  var dateNow = document.createElement('span');

  var timestampToDate = formatarTimestampToDateNow(currentWeather.dt);
  dateNow.textContent = timestampToDate;

  sectionCard.appendChild(cityName);
  sectionCard.appendChild(dateNow);

  var sectionInfos = document.createElement('section');
  sectionInfos.classList.add(
    'wrapper__main-content__current-weather__other-infos'
  );

  var divGroup = document.createElement('div');
  divGroup.classList.add(
    'wrapper__main-content__current-weather__other-infos--group'
  );

  var divWrapper = document.createElement('div');
  divWrapper.classList.add(
    'wrapper__main-content__current-weather__other-infos--group-wrapper'
  );

  var divSunrise = document.createElement('div');
  divSunrise.classList.add(
    'wrapper__main-content__current-weather__other-infos--group-items'
  );

  var divSunriseTitle = document.createElement('span');
  divSunriseTitle.classList.add('span-bold');
  divSunriseTitle.textContent = 'Nascer do sol';

  var divSunriseValue = document.createElement('span');
  divSunriseValue.textContent = formatarTimestampToHour(
    currentWeather.sys.sunrise
  );

  var divSunset = document.createElement('div');
  divSunset.classList.add(
    'wrapper__main-content__current-weather__other-infos--group-items'
  );

  var divSunsetTitle = document.createElement('span');
  divSunsetTitle.classList.add('span-bold');
  divSunsetTitle.textContent = 'Por do sol';

  var divSunsetValue = document.createElement('span');
  divSunsetValue.textContent = formatarTimestampToHour(
    currentWeather.sys.sunset
  );

  var divWind = document.createElement('div');
  divWind.classList.add(
    'wrapper__main-content__current-weather__other-infos--group-items'
  );

  var divWindTitle = document.createElement('span');
  divWindTitle.classList.add('span-bold');
  divWindTitle.textContent = 'Vento';

  var divWindValue = document.createElement('span');
  divWindValue.textContent = calcularVelocidadeVento(currentWeather.wind);

  var divHumidity = document.createElement('div');
  divHumidity.classList.add(
    'wrapper__main-content__current-weather__other-infos--group-items'
  );

  var divHumidityTitle = document.createElement('span');
  divHumidityTitle.classList.add('span-bold');
  divHumidityTitle.textContent = 'Umidade';

  var divHumidityValue = document.createElement('span');
  divHumidityValue.textContent = currentWeather.main.humidity + '%';

  var divPressure = document.createElement('div');
  divPressure.classList.add(
    'wrapper__main-content__current-weather__other-infos--group-items'
  );

  var divPressureTitle = document.createElement('span');
  divPressureTitle.classList.add('span-bold');
  divPressureTitle.textContent = 'Umidade';

  var divPressureValue = document.createElement('span');
  divPressureValue.textContent = currentWeather.main.pressure + 'mb';

  divSunset.appendChild(divSunsetTitle);
  divSunset.appendChild(divSunsetValue);

  divSunrise.appendChild(divSunriseTitle);
  divSunrise.appendChild(divSunriseValue);

  divWind.appendChild(divWindTitle);
  divWind.appendChild(divWindValue);

  divHumidity.appendChild(divHumidityTitle);
  divHumidity.appendChild(divHumidityValue);

  divPressure.appendChild(divPressureTitle);
  divPressure.appendChild(divPressureValue);

  divWrapper.appendChild(divSunrise);
  divWrapper.appendChild(divSunset);
  divWrapper.appendChild(divWind);
  divWrapper.appendChild(divHumidity);
  divWrapper.appendChild(divPressure);

  divGroup.appendChild(divWrapper);
  sectionInfos.appendChild(divGroup);

  currentWeatherContainer.appendChild(sectionCard);
  currentWeatherContainer.appendChild(sectionInfos);

  predictions.forEach((item) => {
    var time = new Date(item.time);
    var hours = time.getHours();
    var formattedTime = hours < 10 ? '0' + hours : hours;

    var weatherCard = document.createElement('div');
    weatherCard.classList.add(
      'wrapper__main-content__next-weathers__next-hours--card'
    );

    var timeElement = document.createElement('strong');
    timeElement.textContent = formattedTime + ':00';

    var weatherIconElement = document.createElement('img');
    weatherIconElement.src = `https://openweathermap.org/img/w/${item.weather.icon}.png`;

    var tempElement = document.createElement('div');
    var maxTempElement = document.createElement('span');
    maxTempElement.classList.add(
      'wrapper__main-content__next-weathers__next-hours--card-max-celsius'
    );
    var tempMax = Math.round(item.temp_max);
    var tempMin = Math.round(item.temp_min);
    maxTempElement.textContent = tempMax + ' ºC';

    var minTempElement = document.createElement('span');
    minTempElement.classList.add(
      'wrapper__main-content__next-weathers__next-hours--card-min-celsius'
    );
    minTempElement.textContent = tempMin + ' ºC';
    tempElement.appendChild(maxTempElement);
    tempElement.appendChild(minTempElement);

    var weatherDescriptionElement = document.createElement('span');
    weatherDescriptionElement.classList.add(
      'wrapper__main-content__next-weathers__next-hours--card-prediction'
    );
    var description =
      item.weather.description.charAt(0).toUpperCase() +
      item.weather.description.slice(1);
    weatherDescriptionElement.textContent = description;

    // Adiciona os elementos ao card
    weatherCard.appendChild(timeElement);
    weatherCard.appendChild(weatherIconElement);
    weatherCard.appendChild(tempElement);
    weatherCard.appendChild(weatherDescriptionElement);

    // Adiciona o card ao container
    weatherContainer.appendChild(weatherCard);
  });

  console.log({ response, predictions, currentWeather });
};

document.getElementById('buttonId').addEventListener('click', mainCall);
