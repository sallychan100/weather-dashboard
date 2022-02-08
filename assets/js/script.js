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
        saveToLocalStorage(city)
        weather(latitude,longitude)
        $('#current-city').text(data.name)
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
        displayCurrent (data);
    })
}

//Display current weather 

var displayCurrent = function (weatherData) {
    var currentTemp = weatherData.current.temp;
    var currentWind = weatherData.current.wind_speed;
    var currentHumidity = weatherData.current.humidity;
    var currentUv= weatherData.current.uvi;
    console.log(weatherData)
    
    
    // document.getElementById("current-date").innerHTML = moment().format("MMM Do YY");
    var currentDate = moment().format("MMM Do YYYY")
    const currentDateDisplay = $("#current-date").text(currentDate)
    const currentTempDisplay = $("#current-temp").text('Tmeperature:  ' + currentTemp + '  °C')
    const currentHumidityDisplay = $("#current-humidity").text('Humidity:  '+ currentHumidity +'   %')
    const currentWindDisplay = $("#current-wind").text('Wind Speed:  '+ currentWind +'  MPH')
    const currentUvDisplay = $("#current-uv").text('UV Index:  '+ currentUv)
    if (currentUv <= 2){
        $("#current-uv").css({"background-color":"#51A638"});  
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

// display forecast

//set past city searches to what's inside LS, if nothing inside LS, set it to an empty array 
//LS always return a string. JSON.parse will a constructing the JavaScript value 

var pastCitySearch = JSON.parse(localStorage.getItem('PastCity'))|| [] 
console.log(pastCitySearch)


function saveToLocalStorage (city){
        if (pastCitySearch.includes(city)){
        alert('Duplicate Search, please look at search history or enter a new')
        } else{ 
        // push() method adds one or more elements to the end of an array 
            pastCitySearch.push(city)
            localStorage.setItem('PastCity', JSON.stringify(pastCitySearch))
            displayPastSearch ()
    }
}
//Displaying past city name 

function displayPastSearch (){
    $('.search-history-buttons').empty()

    //loop over the pastCitySearch array 
    for (var i=0; i < pastCitySearch.length; i++){
        var pastButtonEl = $('<button>')
        pastButtonEl.text(pastCitySearch[i])
        $('.search-history-buttons').append(pastButtonEl)
    }
}

document.getElementById("submit-button").addEventListener("click", formSubmitHandler)
displayPastSearch ()
