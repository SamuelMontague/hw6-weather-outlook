var searchEl = $('#citySearch');
var searchListEl = $('#cityList');

function searchCitySubmit (event){
    event.preventDefault();
    var cityName = $('input[name="citySearchName"]')
    if (!cityName){
        console.log('no city entered to search!');
        return;
    }
    searchListEl.append('<li>' + cityName + '</li>');
    $('input[name="citySearchName').val('');

}

searchEl.on('submit', searchCitySubmit);