const apiKey = "8c6c02d9b70f813c9a3adfe51cbbc402"


$(document).ready(function () {
    console.log("we're working")


    var todayEl = moment()
    $("#todayEl").text(todayEl.format('MMMM Do YYYY, h:mm:ss a'));
    console.log(todayEl);

    var locationArray = [];

    $(".searchBtn").on("click", function (e) {
        e.preventDefault();

        var value = $(this).siblings(".storage").val();
        console.log(value, "value");
        localStorage.setItem(value, "value");

        var recentsBtn = $('<button/>').attr({ type: 'button', name: 'recent', value: "value"})
        recentsBtn.append(value);
        $(".recents").append(value);
    })

    function citySearch(city){
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey + "&units=imperial";
        console.log(apiUrl)

        $.ajax({
            type: "GET",
            url: apiUrl,
            dataType: "json",
            success: function (currentData) {
                var cityName = $("<h3>").addClass("card-title").text(currentData.name);
                var temperature = $("<p>").text("Temp: " + currentData.main.temp + " F\u00B0")
                var windSpeed = $("<p>").text("Wind Speed: " + currentData.wind.speed + "mph")
                var humidity = $("<p>").text("Humidity: " + currentData.main.humidity + "%")
                var icon = $("<div>").addClass("card-body").prepend("<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' alt='Icon depicting current weather.'>")
                var cityDate = getCityDate(currentData.dt)

                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                cardBody.append(cityName, temperature, windSpeed, humidity, icon )
                card.append(cardBody);
                $("#today-weather").append(card);

            }
        })
    }


    function forecastSearch(searchValue) {
        var apiUrl5DayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey + "&units=imperial";

        $.ajax({
            type: "GET",
            url: apiUrl5DayForecast,
            dataType: "json",
            success: function (data) {
                let coordinates = { lat: data.city.coord.lat, long: data.city.coord.lon }
                uvIndex(coordinates)

                for(let i = 0; i < data.list.length; i+= 8) {
                    let fiveDay = {
                        icon: data.list[i].weather[0].icon,
                        temp: data.list[i].main.temp,
                        humidity: data.list[i].main.humidity,
                        wind: data.list[i].main.wind
                    }

                    var titleEL = $("<h2>").addClass("card-title").text(data.name);
                    var tempEl1 = $("<h5>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
                }
            }
        })
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




        





