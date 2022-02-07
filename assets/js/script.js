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

        displayCurrent (city)

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

//Display current weather 
var currentDate = moment().format("MMM Do YYYY")

var displayCurrent = function (city,currentDate,currentTemp,currentHumidity,currentWind,currentUv) {
    // document.getElementById("current-date").innerHTML = moment().format("MMM Do YY");

    const currentCityDisplay = $("#current-city").text(city)
    const currentDateDisplay = $("#current-date").text(currentDate)
    const currentTempDisplay = $("#current-temp").text('Tmeperature:  '+ currentTemp + '  °C')
    const currentHumidityDisplay = $("#current-humidity").text('Humidity:  '+ currentHumidity +'   %')
    const currentWindDisplay = $("#current-wind").text('Wind Speed:  '+ currentWind +'  MPH')
    const currentUvDisplay = $("#current-uv").text('UV Index:  '+ currentUv)
    if (currentUv <= 2){
        $("#current-uv").css({"background-color":"#51A638 "});  
    } if (currentUv >= 3 && currentUv <= 5 ){
        $("#current-uv").css({"background-color":"#F7DC6F"});
    } if (currentUv >= 6 && currentUv <= 7 ){
        $("#current-uv").css({"background-color":"#D68910"});
    } if (currentUv >= 8 && currentUv <= 10 ){
        $("#current-uv").css({"background-color":"#DA4771"});
    } if (currentUv >11){
        $("#current-uv").css({"background-color":"#922B21"}); 
    }
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


document.getElementById("submit-button").addEventListener("click", formSubmitHandler)

