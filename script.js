var searchEl = $('#citySearch');
var searchListEl = $('#cityList');

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

function showWeather(city){
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;
    $.ajax({
        url:url,
        method: "Get"
    })
    .then(function(response){
        console.log(response);

        var weatherIcon= response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn" + weatherIcon + "@2x.png"

        var date =new Date(response.dt*1000).toLocaleDateString();

        $(currentCity).html(response.name +"("+date+"?)" + "<img src="+iconurl+">");
    }
} 



        





