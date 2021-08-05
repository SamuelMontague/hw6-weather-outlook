var apiKey = "8c6c02d9b70f813c9a3adfe51cbbc402"
var previousCities = [];

function searchedCity(e){
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


function restartSearch(city){
    $("#currentCityCard").empty()
    $("#fiveDayLineup").empty()

    getCurrentWeather(city)
    get5DayForecast(city)

    $("#city").val("")

}

function getCurrentWeather(city){
    var apiUrlCurrent = "https://api.openweeathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + appKey
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
    
}



function addToList(c){
    var listEl= $("<li>"+ c.toUpperCase()+ "</li>");
    $(listEl).attr("class", "list-group-item")
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl)
}


function activatePastSearch (e) {
    var liEl=e.target;
    if (e.target.matches("li")){
        city=liEl.textContent.trim()
        currentWeather(city);
    }
}

function loadPreviousCity () {
    $("ul").empty();
    var savedCity = JSON.parse(localStorage.getItem("cityname"))
    if (savedCity!==null){
        savedCity=JSON.parse(localStorage.getItem("cityname"))
        for(i=0; i<savedCity.length;i++){
            addToList(savedCity[i]);
        }
        city=savedCity[i-1];
        currentWeather(city);
    }
}

$("#searchButton").on('click', showWeather)
$(document).on("click", invokePastSearch)
$(window).on("load", loadlastCity);


        





