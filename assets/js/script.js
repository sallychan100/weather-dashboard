// get input from user 
function formSubmitHandler (event)  {
    //prevent page from refreshing when submit button is clicked
    event.preventDefault()
    var cityInput = document.getElementById("city-input").value; 
    getLatAndLon (cityInput)
}
// look up city's lat and lon 
function getLatAndLon (cityInput) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=metric&appid=4d98bc41af7871594d875bc087999e62")
    .then(function (response) {
        if (response.ok) {
          response.json()
          .then(function (data) {
            console.log(data)
        var city = data.name;
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;

        //save to local storage 
        saveToLocalStorage(city,latitude,longitude)

        weather(latitude,longitude)
        })
    }else {
        window.alert('Search unsuccessful. Please enter a valid city name.') 
        }
    
    })
}
function weather (latitude,longitude) {
    //cnt=5 for 5 days forecast 
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=metric&cnt=5&appid=4d98bc41af7871594d875bc087999e62")
    .then(response => response.json()) 
    .then(data => {
        console.log(data)
        var currentTemp = data.current.temp;
        var currentWind = data.current.wind_speed;
        var currentHumidity = data.current.humidity;
        var currentUv= data.current.uvi;
        displayCurrent (currentTemp,currentWind,currentHumidity,currentUv);
    })
}

//Display current date weather 

var displayCurrent = function (currentTemp,currentWind,currentHumidity,currentUv) {
    // document.getElementById("current-date").innerHTML = moment().format("MMM Do YY");
    $("#current-date").append(moment().format("MMM Do YY"))
    $("#current-temp").append('Tmeperature:',currentTemp,' °C')
    $("#current-humidity").append('Humidity:',currentHumidity,' %')
    $("#current-wind").append('Wind Speed:',currentWind,'MPH')
    $("#current-uv").append('UV Index:',currentUv)
}

var pastCitySearch = []

// data from current weather function passed on 
function saveToLocalStorage (city,latitude,longitude){
    pastCitySearch.push(city)
    localStorage.setItem('name', pastCitySearch)
    localStorage.setItem('latitude', latitude)
    localStorage.setItem('longitude', longitude)
}

//Displaying past city name 
// var titleEl = document.createElement('span');

// for (var i = 0; i < pastCitySearch.length; i++) {
//  var pastEl = document.createElement('a');
//     issueEl.classList = 'list-item flex-row justify-space-between align-center';
//     issueEl.setAttribute('href', issues[i].html_url);
//     issueEl.setAttribute('target', '_blank');

//click on past search and re-search again


document.getElementById("submit-button").addEventListener("click", formSubmitHandler)

