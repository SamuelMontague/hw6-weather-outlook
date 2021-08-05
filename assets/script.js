var apiKey = "8c6c02d9b70f813c9a3adfe51cbbc402"
var previousCities = [];

function citySearch(e){
    e.preventDefault();
    city = $("#city").val()
    if(city){
        $("#currentCityCard").empty()
        $("#fiveDayLineup").empty()

        getCurrentWeather(city)
        get5DayForecast(city)

        $("#city").val("")
    }
}


function redoSearch(city){
    $("#currentCityCard").empty()
    $("#fiveDayLineup").empty()

    getCurrentWeather(city)
    get5DayForecast(city)

    $("#city").val("")

}

function getCurrentWeather(city){
    var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey
    fetch(apiUrlCurrent)
    .then(function (response){
        return response.json
    })
    .then(function (data) {
        renderCurrentWeather(data)
    })
}  

function renderCurrentWeather(currentData){
    var cityName = $("<h3>")
    var temperature = $("<p>").text("Temp: " + currentData.main.temp + " F\u00B0")
    var windSpeed = $("<p>").text("Wind Speed: " + currentData.wind.speed + "mph")
    var humidity = $("<p>").text("Humidity: " + currentData.main.humidity + "%")
    var currentWeather = $("#currentWeatherCard")
    var image = getIconImage(currentData.weather[0].icon)
    var cityDate = getCityDate(currentData.dt)
    cityName[0].innerHTML = "Current Conditions: " + currentData.name + cityDate
    cityName.append(image)
    currentWeather.append(cityName)
    currentWeather.append(temperature)
    currentWeather.append(windSpeed)
    currentWeather.append(humidity)
    saveSearches(currentData.name)
    renderSearches()
}

function get5DayForecast(city) {
    var apiUrl5DayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey
    fetch(apiUrl5DayForecast)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        render5DayForecast(data)
    })
}

function render5DayForecast(currentForecast){
    var fiveDayCard = $("#fiveDayCard");
    var fiveDayTitle = $("<h3>").text("5-Day Forecast");
    fiveDayCard.append(fiveDayTitle);
    var container = $("<div>").addClass("row");
    fiveDayCard.append(container)

    for (var i=0; i < currentForecast.list.length; i+= 8){
        var day = $("<div>").addClass( "col-sm-12 col-md-4 col-lg-2 test2 d-flex flex-column justify-content-center fiveDayCard" );
        var date = $("<h4>").text(getCityDate(currentForecast.list[i].dt));
        var image = getIconImage(currentForecast.list[i].weather[0].icon)
        var temp = $("<p>").text("Temp: " + currentForecast.list[i].main.temp + " F\u00B0");
        var wind = $("<p>").text("Wind: " + currentForecast.list[i].wind.speed + "mph")
        var humidity = $("<p>").text("Humidity: " + currentForecast.list[i].main.humidity + "%")
        day.append(date);
        day.append(image);
        day.append(temp);
        day.append(wind);
        day.append(humidity);
        container.append(day);
    }
}


function getCityDate(unix) {
    var a = new Date(unix * 1000);
    var cityDate = " (" + (a.getMonth() + 1) + "-" + a.getDate() + "-" + a.getFullYear() + ") ";
    return cityDate;
}

function getIconImage(iconCode) {
    var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    var image = $("<img>")
    image.attr({src: iconUrl, width: 50, height: 50});
    return image;
}

function saveSearches(searchName) {
    if (previousCities.includes(searchName)) {
        return;
    } else if(previousCities.length >= 8) {
        previousCities.shift();
        previousCities.push(searchName);
        localStorage.setItem("previousCities", JSON.stringify(previousCities))
    } else {
        previousCities.push(searchName);
        localStorage.setItem("previousCities", JSON.stringify(previousCities))
    }
}

function renderSearches() {
    var previousCitiesList = $("#previousCities")
    previousCitiesList.empty();
    var searches = JSON.parse(localStorage.getItem("previousCities"))
    for (var i = 0; i < searches.length; i++ ) {
        var btn = $("<button>").text(searches[i])
        btn.addClass(" col-12 previousCities")
        previousCitiesList.append(btn);
    }
}

$("#previousCities").on("click", function (e) {
    console.log(e.target.innerHTML);
    var city = e.target.innerHTML
    redoSearch(city)
})

$("#search").on("click", citySearch)




        





