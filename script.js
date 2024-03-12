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

  sectionCard.appendChild(cityName);
  sectionCard.appendChild(dateNow);

  currentWeatherContainer.appendChild(sectionCard);

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
