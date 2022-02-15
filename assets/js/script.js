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
        // console.log(data)
        displayCurrent (data);
        displayForecast(data);
    })
}

//Display current weather 

var displayCurrent = function (weatherData) {
    var currentTemp = weatherData.current.temp;
    var currentWind = weatherData.current.wind_speed;
    var currentHumidity = weatherData.current.humidity;
    var currentUv= weatherData.current.uvi;
    var icon = weatherData.current.weather[0].icon
    // console.log(weatherData)
    
    // document.getElementById("current-date").innerHTML = moment().format("MMM Do YY");
    var currentDate = moment().format('MMMM Do YYYY, h:mm:ss a')
     $("#current-date").text(currentDate)
     $('#icon').attr('src', `http://openweathermap.org/img/wn/${icon}@2x.png`)
    $("#current-temp").text('Temperature:' + currentTemp + '  °C')
    $("#current-humidity").text('Humidity:'+ currentHumidity +'   %')
    $("#current-wind").text('Wind Speed:'+ currentWind +'  MPH')
    $("#current-uv").text('UV Index:  '+ currentUv)
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
//set past city searches to what's inside LS, if nothing inside LS, set it to an empty array 
//LS always return a string. JSON.parse will a constructing the JavaScript value 

var pastCitySearch = JSON.parse(localStorage.getItem('PastCity'))|| [] 
console.log(pastCitySearch)


function saveToLocalStorage (city){
//if duplicate city name is found in LS, don't add twice to LS 
        if (!pastCitySearch.includes(city)){
        // push() method adds one or more elements to the end of an array 
            pastCitySearch.push(city)
            localStorage.setItem('PastCity', JSON.stringify(pastCitySearch))
            displayPastSearch ()
    }
}
//Displaying past city name 

function displayPastSearch (){
    $('.search-history-buttons').empty()

    //adding past search buttons by looping over the pastCitySearch array 
    for (var i=0; i < pastCitySearch.length; i++){
        var pastButtonEl = $('<button>')
        pastButtonEl.text(pastCitySearch[i])
        $('.search-history-buttons').append(pastButtonEl)

        //re-do search
        pastButtonEl.click(function() {
            // console.log(this)
            getLatAndLon(this.textContent);
          });
    }
}

// adding forecast cards
function displayForecast(forecastData){
    
    var cards = $('.cards');

    //empty container before adding anything new 
    cards.empty()


    for (var i=1 ;i<5 ;i++){
    
    //get date 
    var futureDate = moment().add(i, 'days').format("MMM Do YY")
    //extracting and catagorizing data 
    var minTemp = forecastData.daily[i].temp.min
    var maxTemp = forecastData.daily[i].temp.max
    var windSpeedForecast = forecastData.daily[i].wind_speed
    var humidityForecast = forecastData.daily[i].humidity
    var conditionForecast = forecastData.daily[i].weather[0].main
    var icon = forecastData.daily[i].weather[0].icon

// Create forecast card elements and give it an class of 'section-title'
    var forecastCardEl = `<div class = "section-title">
    <div>${futureDate}</div>
    <img src = "http://openweathermap.org/img/wn/${icon}@2x.png">
    <div> ${conditionForecast} </div>
    <div> Temperature : ${minTemp} °C to  ${maxTemp} °C </div>
    <div> Wind: ${windSpeedForecast} MPH </div>
    <div> Humidity: ${humidityForecast} % </div>
    </div>`
// append to forecast cards section 
    cards.append(forecastCardEl)
  }
}


document.getElementById("submit-button").addEventListener("click", formSubmitHandler)
displayPastSearch ()
