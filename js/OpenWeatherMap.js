(function () {

  const openWeatherMapApiKey = "1442668b20e7cfe9be7420e005dcfa6a";
  const openWeatherMapApiBasePath = "http://api.openweathermap.org/data/2.5/weather";
  const openweathermapIconBasePath = "https://openweathermap.org/img/wn/";
  const openWeatherMapCityBasePath = "https://openweathermap.org/city/";

  $(document).ready(Setup);

  function Setup() {
    $('#btnLoad')
      .on('click', btnLoad_Click)
      .on('keyup', btnLoad_KeyUp);

    $('#btnClear')
      .on('click', btnClear_Click);
    
    FocusTextBox();
  }

  function btnLoad_Click() {
    var city = $('#txtCity').val();

    LoadWeatherData(city);
    FocusTextBox();
  }

  function btnLoad_KeyUp(e) {
    e.preventDefault();

    if (e.which != 13) {
      return;
    }

    LoadWeatherData($("#txtCity").val());
    FocusTextbox();
  }

  function btnClear_Click() {
    $('#results')
      .empty();
    
    FocusTextBox();
  }

  function LoadWeatherData(city) {
    var url = GetWeatherUrl(city);

    $.ajax({
      url: url,
      success: LoadWeatherData_OnSuccess
    });
  }

  function LoadWeatherData_OnSuccess(data) {
    var viewModel = {
      iconUrl: GetOpenWeatherMapIconUrl(data),
      iconDescription: data.weather[0].description,
      cityUrl: GetOpenWeatherMapCityUrl(data),
      cityName: data.name,
      countryCode: data.sys.country,
      temperature: data.main.temp,
      cityId: data.id
    };

    var card = GenerateCard(viewModel);

    $('#results')
      .append(card);

    InitializeMap(viewModel.cityId, data.coord);
  }

  function InitializeMap(cityId, coordinates) {
    var coord = [coordinates.lat, coordinates.lon];

    var map = L.map('city_' + cityId).setView(coord, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker(coord).addTo(map);
  }

  function GetOpenWeatherMapCityUrl(data) {
    return openWeatherMapCityBasePath + data.id;
  }

  function GetOpenWeatherMapIconUrl(data){
    return openweathermapIconBasePath + data.weather[0].icon + '@2x.png';
  }

  function GenerateCard(data) {
    var icon = $('<img />')
      .attr({
        src: data.iconUrl,
        alt: data.iconDescription
      });
    
    var headerLink = $('<a />')
      .attr({
        href: data.cityUrl,
        target: '_blank'
      })
      .append(data.cityName);

    var country = $('<span />')
      .addClass([
        'text-muted',
        'fs-6'
      ])
      .append('&nbsp;(' + data.countryCode + ')');

    var bodyHeader = $('<h3 />')
      .addClass('card-title')
      .append(icon)
      .append(headerLink)
      .append(country);
    
    var bodyText = $('<p />')
      .addClass('card-text')
      .html(
        'Het is momenteel <span class="fs-3 fw-bold">' + data.temperature + '°C</span>' +
        ' en <span class="fs-3 fw-bold">' + data.iconDescription + '</span>' + 
        ' in <span class="fs-3 fw-bold">' + data.cityName + '</span>'
      );

    var body = $('<div />')
      .addClass('card-body')
      .append(bodyHeader)
      .append(bodyText);

    var map = $('<div />')
      .attr('id', 'city_' + data.cityId)
      .addClass([
        'card-img-top',
        'min-height-xl'
      ]);

    var card = $('<div />')
      .addClass([
        'card',
        'mt-3'
      ])
      .append(map)
      .append(body);
    
    var col = $('<div />')
      .addClass('col')
      .append(card);
    
    return col;
  }

  function GetWeatherUrl(city) {
    var url = openWeatherMapApiBasePath;
    url += '?q=' + city;
    url += '&units=metric';
    url += '&lang=nl';
    url += '&appId=' + openWeatherMapApiKey;

    return url;
  }

  function FocusTextBox() {
    $('#txtCity')
      .focus()
      .val('');
  }

})();