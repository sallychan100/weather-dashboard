var pastCitySearch = []

function cityNameFromUser (event)  {
    //prevent page from refreshing when submit button is clicked
    event.preventDefault()
    var cityInput = document.getElementById("city-input").value; 
    currentWeather (cityInput)
}
// parameter latitude,longitude were passed on

function currentWeather (cityInput) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=4d98bc41af7871594d875bc087999e62")
    .then(function (response) {
        if (response.ok) {
          response.json()
          .then(function (data) {
        console.log(data)
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        var city = data.name;
        saveToLocalStorage(city)
        forecast(latitude,longitude)
        }
    } else {
        alert('Search unsuccessful. Please enter a valid city name.') 
        }
    
    })
}

function forecast (latitude,longitude) {
    //cnt=5 for 5 days forecast
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&cnt=5&appid=4d98bc41af7871594d875bc087999e62")
    .then(response => response.json()) 
    .then(data => {
        console.log(data)
    })
}
function saveToLocalStorage (city){
    pastCitySearch.push(city)
    localStorage.setItem('name', pastCitySearch)
}

document.getElementById("submit-button").addEventListener("click", cityNameFromUser)

