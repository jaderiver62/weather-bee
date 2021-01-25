var weatherArray = [];

var resultMainEl = document.getElementById("search-result-container");

var searchBtn = document.getElementById("btn");
// This function provides the ability to save a search entry in the localStorage and notes it in the console
function saveSearch() {
    localStorage.setItem("weatherArray", JSON.stringify(weatherArray));
    console.log("search recorded");
};
// This function uses saved search entries to polulate the history bar - which link the the weather information for that search
var createHistory = function() {

    var historyList = document.createElement("div");
    var historyDivEl = document.getElementById("history-section");
    historyDivEl.innerHTML = "";
    for (var i = 0; i < weatherArray.length; i++) {
        var entry = weatherArray[i];
        var historySearchEl = document.createElement("div");
        historySearchEl.className = "history-el";
        var historyBtn = document.createElement("button");
        historyBtn.textContent = entry;
        historyBtn.className = "history-btn btn-lg";
        historyBtn.setAttribute("value", entry);
        historyBtn.setAttribute("style", "width: 100%; background-color: white; border-radius: 3px; border: 2px solid #E8E8E8;");
        historySearchEl.appendChild(historyBtn);
        historyList.appendChild(historySearchEl);
        historyBtn.addEventListener("click", historyBtnHandler);
    }
    historyDivEl.appendChild(historyList);


};
// A button that calls the getCoordinates() function to get weather data for the saved entries in the history
var historyBtnHandler = function(event) {
    event.preventDefault();
    var currentSearch = event.target.value;
    getCoordinates(currentSearch);
};

// A button that reads the search input to get weather data
var searchHandler = function(event) {
    event.preventDefault();

    var inputContent = document.getElementById("citySelection").value;
    if (inputContent) {
        getCoordinates(inputContent);
    };


};

// Listener for the maind search button
searchBtn.addEventListener("click", searchHandler);

// A function to check if the saved entries already holds a location - this way we don't repeat ourselves and waste space
var isDuplicate = function(entry) {
    for (var i = 0; i < weatherArray.length; i++) {
        if (entry === weatherArray[i]) {
            return true;
        }
    }
    return false;
};

// This is the main function that accesses an API that gets the longitude and latitude coordinates of a city
var getCoordinates = function(input) {
    console.log(input);
    var apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" +
        input + "&key=974cf3d56a9f45d58e79a7ec8b1f7842";
    // Geocode API - Open cage Data
    fetch(apiUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                input = data.results[0].formatted;
                getWeather(data, input);
                // Plug the response data into the next function - getWeather()
            });
        } else {
            alert("Error: " + response.statusText);
            // Check for problems
        }
    });
};

/*
This function accesses the Open Weather Map API to use the longitude and latitude coordinates 
we retrieved from the previous API and finds the data for that location
*/
var getWeather = function(data, searchTerm) {

    console.log(data);
    var latEl = data.results[0].geometry.lat;
    var lngEl = data.results[0].geometry.lng;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latEl + "&lon=" + lngEl + "&appid=3812ea6836536b0581712ffd66f54fa5&units=imperial";


    fetch(apiUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, searchTerm);
                // Plug the response data into displayWeather() to make the output accessible to the user
            });
        } else {
            alert("Error: " + response.statusText);
            // Check for problems
        }
    });

};

// A function that displays the weather data for the requested location
var displayWeather = function(data, searchTerm) {
    resultMainEl.innerHTML = "";
    var checkDuplicate = isDuplicate(searchTerm);
    if (!checkDuplicate) {
        weatherArray.push(searchTerm);

    }
    saveSearch();
    createHistory();
    resultMainEl.setAttribute("style", "padding: 10px 10px; display: inline-block;");

    var resultTopDivEl = document.createElement("div");

    resultTopDivEl.className = "container";
    resultTopDivEl.setAttribute("style", "padding: 10px; display: flex;");
    resultTopDivEl.className = "top-result d-flex justify-contents-around";

    var textDivEl = document.createElement('div');
    resultTopDivEl.className = "container";
    resultTopDivEl.setAttribute("style", "border: 1px solid #E8E8E8; padding: 20px; display: flex;");
    resultTopDivEl.className = "top-result d-flex justify-contents-around";

    var textDivEl = document.createElement('div');

    textDivEl.className = "text";

    var imageDivEl = document.createElement('div');
    imageDivEl.className = "image";

    var myIconEl = document.createElement('img');

    var iconIdEl = data.current.weather[0].icon;

    var link = "https://openweathermap.org/img/wn/" + iconIdEl + "@2x.png";
    // The API conatins these cute icons so I incorporated them
    myIconEl.src = link;


    var textDivHeadingEl = document.createElement('div');
    textDivHeadingEl.className = "text";
    textDivHeadingEl.innerHTML = "<h2>" + searchTerm + "  (" + moment().format('L') + ") </h2><br>";


    var textDivContentEl = document.createElement('div');

    textDivContentEl.className = "text";
    // Calls this function createBadge() to generate a badge for the UVI rating
    var uvBadgeElement = createBadge(data);
    textDivContentEl.innerHTML = "<p class='description'>" + data.current.weather[0].description +
        "</p><br><h5>Temperature: " + data.current.temp + " F<br><br>Humidity: " + data.current.humidity +
        "%<br><br>Wind Speed: " + data.current.wind_speed + " MPH<br><br><br><div class='uv-i d-flex justify-contents-around'>UV Index:   &nbsp &nbsp" +
        uvBadgeElement + "</h5></div>";

    textDivEl.appendChild(textDivHeadingEl);
    textDivEl.appendChild(textDivContentEl);

    imageDivEl.appendChild(myIconEl);

    resultTopDivEl.appendChild(textDivEl);
    resultTopDivEl.appendChild(imageDivEl);
    resultMainEl.appendChild(resultTopDivEl);

    createForecast(data);

    console.log(data);

};

/* This function takes the value of the UV Index returned for a 
location and chooses a color based on the risk factor */

var createBadge = function(data) {
    var badgeCode = "<h3><span class='badge text-light bg-";
    var uvValue = data.current.uvi;
    if (uvValue <= 2) {
        badgeCode += "success";
    } else if (uvValue <= 5) {
        badgeCode += "secondary";
    } else if (uvValue <= 7) {
        badgeCode += "warning";
    } else {
        badgeCode += "danger";
    }
    badgeCode += "'>" + uvValue + "</span></h3>";
    return badgeCode;
};
// I used the built in bootstrap badge classes for this


// A 5-Day Forecast generating function 
var createForecast = function(data) {
    var forecastContainerEl = document.createElement('div');
    forecastContainerEl.className = "row"
    forecastContainerEl.setAttribute("style", "padding: 15px; width: 100%;");
    var forecastHeader = document.createElement("h3");
    forecastHeader.innerHTML = "<br>5-Day Forecast";
    resultMainEl.appendChild(forecastHeader);

    for (var i = 0; i < 5; i++) {
        var momentIndex = i + 1;
        var forecastIcon = data.daily[i].weather[0].icon;

        var forecastLink = "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";

        var newColumn = document.createElement('div');
        newColumn.className = "new-column col-10 col-sm-6 col-md-6 col-lg-5 col-xl-2";

        newColumn.setAttribute("style", "text-align: center; padding:10px; color: white; height: 350px; border: 10px solid white; background-color:  rgb(75, 116, 231); min-width: 230px;max-width: 230px;  margin: auto;");
        var newColumnInterior = document.createElement('div');
        newColumnInterior.className = "forecast-card p-3";
        newColumnInterior.innerHTML = "<h4 class='date-header'>" + moment().add(momentIndex, 'd').format('L') +
            "</h4><br><br><img src='" + forecastLink + "' alt='weather-icon'><br><br><p class='description'>" +
            data.daily[i].weather[0].description + "</p>Temp: " + data.daily[i].temp.day + " F<br>Humidity: " +
            data.daily[i].humidity + "%";
        newColumn.appendChild(newColumnInterior);
        forecastContainerEl.appendChild(newColumn);
    }

    resultMainEl.appendChild(forecastContainerEl);


};

// This function loads the data saved in the localStorage and intiates the createHistory function
function loadSearch() {
    var savedSearches = JSON.parse(localStorage.getItem("weatherArray"));

    if (savedSearches) {
        weatherArray = savedSearches;
    } else { return false; }
    console.log("Search History Found...");
    weatherArray = JSON.parse(JSON.stringify(savedSearches));
    createHistory();
};

// Calls loadSearch() to load the saved entries up as the page loads

loadSearch();

// I set this interval for the page to refresh every 30 mins since that is when the weather data is updated
setInterval(function() {
    window.location.reload();
}, 30 * 60000);