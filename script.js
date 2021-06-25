var searchEl = $('#citySearch');
var searchListEl = $('#cityList');
var searchButton = $('#searchButton');
var currentCity = $('#currentCity');
var currentTemp = $('#temp');
var currentHum = $('#hum')
var currentSpeed= $('#windSpeed')
var currentUVind = $('#uvIndex')
var savedCity = [];

function find(city){
    for (var i=0; i<savedCity.length; i++){
        if(city.toUpperCase()===savedCity[i]){
            return -1;
        }
    }
    return 1;
}

var apiKey = "8c6c02d9b70f813c9a3adfe51cbbc402"

function displayWeather(e){
    e.preventDefault();
    if(searchEl.val().trim()!==""){
        city=searchEl.val().trim();
        showWeather(city);
    }
}

function showWeather(city){
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
    $.ajax({
        url:url,
        method: "Get"
    }).then( function(response){
        console.log(response);

        var weatherIcon= response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn" + weatherIcon + "@2x.png"

        var date =new Date(response.dt*1000).toLocaleDateString();

        $(currentCity).html(response.name +"("+date+"?)" + "<img src="+iconurl+">");
    
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemp).html((tempF).toFixed(2)+"&#8457")

        $(currentHum).html(response.main.humidity+"%");

        var ws=response.wind.speed;
        var windsmph = (ws*2.237).toFixed(1);
        $(currentSpeed).html(windsmph+"MPH");

        uvindex(response.coord.lon, response.coord.lat);
        forecast(response.id)
            savedCity=JSON.parse(localStorage.getItem("cityname"))
            //console.log(savedCity);
            if (savedCity==null){
                savedCity=[];
                savedCity.push(city.toUpperCase()
                )
                localStorage.setItem("cityname",JSON.stringify(savedCity))
                addToList(city)
            }
            else {
                if (find(city)>0){
                    savedCity.push(city.toUpperCase())
                    localStorage.setItem("cityname", JSON.stringify(savedCity))
                    addToList(city);
                }
            }
        }        
    )
}    
function uvindex(ln, lt){
    var url = "https://api.openweeathermap.org/data/2.5/uvi?appid=" + apiKey+ "&lat="+lt+ "&lon=" +ln;
    $.ajax({
        url:url,
        method:"GET"
    }) .then(function(response){
        $(currentUVind).html(response.value);
    })
}

function forecast(cityid){
    var dayend= false;
    var url = "api.openweathermap.org/data/2.5/forecast/daily?id"= + cityid + "&cnt=" + 5+ "&appid=" + apiKey;
    $.ajax({
        url:url,
        method:"GET"
    }) .then(function(response){

        for (i=0; i<5; i++){
            var date = new Date((response.ist[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconmath = response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/wn/"+ iconmath+".png"
            var tempKal = response.list[((i+1)*8)-1].main.temp
            var tempF = (((tempK-273.5)*1.80)+32).toFixed(2);
            var humid = repsonse.list[((i+1*8)-1)].main.humidity



        $("#fDate" +i).html(date);
        $("#fImg" + i).html("<img src="+iconurl+">")
        $("#fTemp" +i).html(tempF+ "&#8457")
        $("#fHumidity" +i).html(humidity+"%");

        }


    })
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


        





