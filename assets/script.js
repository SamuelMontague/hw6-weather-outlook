var apiKey = "8c6c02d9b70f813c9a3adfe51cbbc402";
var storeWeather = JSON.parse(localStorage.getItem('weather')) || [];

if( storeWeather.length !=0){
    getWeatherSearch();
    fillWeatherInfo(0);
    getWeatherForecast(0);
}

$('#search-button').on('click', function() {
    var searchInput = $('#search-field').val();
    var citySearch = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appId=${apiKey}`;
    var forecastSearch = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=imperial&appId=${apiKey}`;

    $.ajax({
        url: citySearch,
        method: 'GET'
    }).then(function(response) {
        var tempWeather = response;

        $.ajax({
            url: forecastSearch,
            method: 'GET'
        }).then(function(response) {
            tempForecast = response;
            getWeatherSearch();
            updateStoredWeather(tempWeather.name, tempWeather, tempForecast, response);
            fillWeatherInfo(storeWeather.length-1);
            getWeatherForecast(storeWeather.length-1);
        })

    })

})

$(document).on('click', '.weatherSearch', function(){
    var index = this.value;
    fillWeatherInfo(index);
    getWeatherForecast(index);
})

function fillWeatherInfo(index){
    var temp = storeWeather[index].currentWeather;
    var weatherIcon = temp.weather[0].icon;

$('#city').text(temp.name)
  $('#icon').attr("src", `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
  $('#icon').attr("alt", temp.weather[0].description)
  $('#temperature').text(`Temperature: ${Math.round(temp.main.temp)}°`)
  $('#humidity').text(`Humidity: ${temp.main.humidity}%`)
  $('#wind-speed').text(`Wind Speed: ${Math.round(temp.wind.speed)} MPH`)
  $('#feels-like').text(`Feels Like: ${Math.round(temp.main.feels_like)}°`)
}

function getWeatherSearch() {
    $('#history').empty();

    for(let i = 0; i < storeWeather.length; i++) {
        var location = storeWeather[i].location;
        var btn = $('<button>').text(location);

        btn.attr({
            class: "weatherSearch btn btn-outline-secondary",
            value: i
        })

        $('#history').append(btn);
    }

}

function getWeatherForecast(index) {
    $('#forecast').empty();

    var temp = storeWeather[index].forecast;
    var count = 8;
    var dayIndex = [0, count, 2*count, 3*count, 4*count]

    for(let i = 0; i < dayIndex.length; i++) {
        var tempWeather = temp.list[dayIndex[i]]

        $('.hidden').removeClass('hidden');
        $('#forecast').append(`
        <div class="card">
        <div class="card-header">
        <h5 class="card-title">${moment(tempWeather.dt_txt).format('dddd, MMM Do')}</h5>
        </div>\n
        <div class="card-body"><img src="https://openweathermap.org/img/wn/${tempWeather.weather[0].icon}@2x.png" />
        <p class="card-text">Temp: ${Math.round(tempWeather.main.temp)}°</p>\n
        <p>Wind: ${Math.round(tempWeather.wind.speed)} MPH</p>\n
        <p>Humidity: ${tempWeather.main.humidity}%</p>\n
        <p>Feels Like: ${Math.round(tempWeather.main.feels_like)}°</p></div></div>`)
      }
}

function updateStoredWeather(location, currentWeather, forecast){
    var tempObj ={
        location: "",
        currentWeather: {},
        forecast: {},
    }
    tempObj.location = location;
    tempObj.currentWeather = currentWeather;
    tempObj.forecast = forecast;
    storeWeather.push(tempObj);
    localStorage.setItem('weather', JSON.stringify(storeWeather));
}

$('#clear').on('click', function(){
    localStorage.clear();
    location.reload();
})



// $(document).ready(function () {
    
//     var todayEl = moment()
//     $("#todayEl").text(todayEl.format('MMMM Do YYYY, h:mm:ss a'));


//     $(".searchBtn").on("click", function (e) {
//         e.preventDefault();

//         var value = $(this).siblings(".saved").val();
//         localStorage.setItem(value, "value");

//         var recentsBtn = $('<button/>').attr({ type: 'button', name: 'recents', value: "value"})
//         recentsBtn.append(value);
//         $(".recents").append(value);
//     })


//     var apiKey = "8c6c02d9b70f813c9a3adfe51cbbc402"


//     function citySearch(city){
//         var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
//         console.log(apiUrl)

//         $.ajax({
//             type: "GET",
//             url: apiUrl,
//             dataType: "json",
//             success: function (data) {
//                 var cityName = $("<h2>").addClass("card-title").text(data.name);
//                 var temperature = $("<h5>").text("Temp: " + data.main.temp + " °F")
//                 var windSpeed = $("<h5>").text("Wind Speed: " + data.wind.speed + "mph")
//                 var humidity = $("<h5>").text("Humidity: " + data.main.humidity + "%")
//                 var icon = $("<div>").addClass("card-body").prepend("<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' alt='Icon for current weather.'>")
        

//                 var card = $("<div>").addClass("card");
//                 var cardBody = $("<div>").addClass("card-body");
//                 cardBody.append(cityName, temperature, windSpeed, humidity, icon )
//                 card.append(cardBody);
//                 $("#today-weather").append(card);

//             }
//         })
//     }


//     function forecastSearch(city) {
//         var apiUrl5DayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

//         $.ajax({
//             type: "GET",
//             url: apiUrl5DayForecast,
//             dataType: "json",
//             success: function (data) {
//                 let coordinates = { lat: data.city.coord.lat, long: data.city.coord.lon }
//                 uvIndex(coordinates)

//                 for(let i = 0; i < data.list.length; i+= 9) {
//                     let fiveDayForecast = {
//                         icon: data.list[i].weather[0].icon,
//                         temp: data.list[i].main.temp,
//                         humidity: data.list[i].main.humidity,
//                         wind: data.list[i].main.wind
//                     }

//                     var titleElement = $("<h2>").addClass("card-title").text(data.name);
//                     var tempElement = $("<h5>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
//                     var humidityElement = $("<h5>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + " %");
//                     var windElement = $("<h5>").addClass("card-text").text("Wind speed: " + data.list[i].wind.speed + " MPH");
//                     var currentIcon = $("<div>").addClass("card-body").prepend("<img src='http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
//                     var card1 = $("<div>").addClass("card");
//                     var cardBody1 = $("<div>").addClass("card-body");
//                     cardBody1.append(titleElement, tempElement, humidityElement, windElement, currentIcon);
//                     card1.append(cardBody1)
//                     $(".five-day").append(card1);

//                 }
//             }
//         })
//     }


//     function uvIndex(coordinates) {
//         var IndexUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coordinates.lat + "&lon=" + coordinates.long + "&appid=" + apiKey;

//         $.ajax({
//             type: "GET",
//             url: IndexUrl,
//             dataTypes: "json",
            
//         })
//     }

//     $(".searchBtn").on("click", function (e) {
//         e.preventDefault();
//         var searchValue = $('#search-city').val()

//         citySearch(searchValue)

//         forecastSearch(searchValue)
//     })
// }) 




        





