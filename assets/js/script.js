var weatherArray = [];

var resultMainEl = document.getElementById("search-result-container");

var searchBtn = document.getElementById("btn");

var searchHandler = function(event) {
    event.preventDefault();
    var resultEl = document.getElementById("search-result-container");
    var inputContent = document.getElementById("citySelection").value;
    if (inputContent) {
        getCoordinates(inputContent);


    };
};
searchBtn.addEventListener("click", searchHandler);

var getCoordinates = function(input) {
    console.log(input);
    var apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + input + "&key=974cf3d56a9f45d58e79a7ec8b1f7842";

    fetch(apiUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                input = data.results[0].formatted;
                getWeather(data, input);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

var getWeather = function(data, searchTerm) {

    console.log(data);
    var latEl = data.results[0].geometry.lat;
    var lngEl = data.results[0].geometry.lng;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lngEl + "&appid=3812ea6836536b0581712ffd66f54fa5&units=imperial";


    fetch(apiUrl).then(function(response) {

        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, searchTerm);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });

};
var displayWeather = function(data, searchTerm) {
    resultMainEl.innerHTML = "";


    weatherArray.push(searchTerm);
    saveSearch();

    resultMainEl.setAttribute("style", "border: 1px solid black; padding: 10px 10px; display: inline-block;");

    var resultTopDivEl = document.createElement("div");

    resultTopDivEl.className = "container";
    resultTopDivEl.setAttribute("style", "padding: 10px; display: flex;");
    resultTopDivEl.className = "top-result d-flex justify-contents-around";

    var textDivEl = document.createElement('div');
    resultTopDivEl.className = "container";
    resultTopDivEl.setAttribute("style", "padding: 10px; display: flex;");
    resultTopDivEl.className = "top-result d-flex justify-contents-around";

    var textDivEl = document.createElement('div');

    textDivEl.className = "text";

    var imageDivEl = document.createElement('div');
    imageDivEl.className = "image";

    var myIconEl = document.createElement('img');

    var iconIdEl = data.current.weather[0].icon;

    var link = "http://openweathermap.org/img/wn/" + iconIdEl + "@2x.png";

    myIconEl.src = link;


    var textDivHeadingEl = document.createElement('div');
    textDivHeadingEl.className = "text";
    textDivHeadingEl.innerHTML = "<h2>" + searchTerm + "  (" + moment().format('L') + ") </h2><br>";


    var textDivContentEl = document.createElement('div');

    textDivContentEl.className = "text";
    var uvBadgeElement = createBadge(data);
    textDivContentEl.innerHTML = "<p class='description'>" + data.current.weather[0].description + "</p><br><h5>Temperature: " + data.current.temp + " F<br><br>Humidity: " + data.current.humidity + "%<br><br>Wind Speed: " + data.current.wind_speed + " MPH<br><br>UV Index: </h5>" + uvBadgeElement;

    textDivEl.appendChild(textDivHeadingEl);
    textDivEl.appendChild(textDivContentEl);

    imageDivEl.appendChild(myIconEl);

    resultTopDivEl.appendChild(textDivEl);
    resultTopDivEl.appendChild(imageDivEl);
    resultMainEl.appendChild(resultTopDivEl);

    createForecast(data);

    console.log(data);

};

// Forecast
var createForecast = function(data) {
    var forecastContainerEl = document.createElement('div');
    forecastContainerEl.className = "row"
    forecastContainerEl.setAttribute("style", "padding: 15px; width: 100%");
    var forecastHeader = document.createElement("h3");
    forecastHeader.textContent = "5-Day Forecast";
    resultMainEl.appendChild(forecastHeader);

    for (var i = 0; i < 5; i++) {
        var momentIndex = i + 1;
        var forecastIcon = data.daily[i].weather[0].icon;

        var forecastLink = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";

        var newColumn = document.createElement('div');
        newColumn.className = "col-10 col-sm-10 col-md-2 col-lg-2 col-xl-2";

        newColumn.setAttribute("style", "text-align: center; color: white; padding:0; min-height: 150px; background-color: indigo; margin: auto; max-width: 200px; border: 10px solid white; min-width: 200px;  margin: auto;");
        var newColumnInterior = document.createElement('div');
        newColumnInterior.className = "div";
        newColumnInterior.innerHTML = "<h4 class='date-header'>(" + moment().add(momentIndex, 'd').format('L') + ")</h4><br><br><img src='" + forecastLink + "' alt='weather-icon'><br><br><p class='description'>" + data.daily[i].weather[0].description + "</p>Temp: " + data.daily[i].temp.day + " F<br>Humidity: " + data.daily[i].humidity + "%";
        newColumn.appendChild(newColumnInterior);
        forecastContainerEl.appendChild(newColumn);
    }

    resultMainEl.appendChild(forecastContainerEl);


};
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



// Forecast
var createForecast = function(data) {
    var forecastContainerEl = document.createElement('div');
    forecastContainerEl.className = "row"
    forecastContainerEl.setAttribute("style", "padding: 15px; width: 100%");
    var forecastHeader = document.createElement("h3");
    forecastHeader.textContent = "5-Day Forecast";
    resultMainEl.appendChild(forecastHeader);

    for (var i = 0; i < 5; i++) {
        var momentIndex = i + 1;
        var forecastIcon = data.daily[i].weather[0].icon;

        var forecastLink = "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";

        var newColumn = document.createElement('div');
        newColumn.className = "col-10 col-sm-10 col-md-2 col-lg-2 col-xl-2";

        newColumn.setAttribute("style", "text-align: center; color: white; padding:0; min-height: 150px; background-color: indigo; margin: auto; max-width: 200px; border: 10px solid white; min-width: 200px;  margin: auto;");
        var newColumnInterior = document.createElement('div');
        newColumnInterior.className = "div";
        newColumnInterior.innerHTML = "<h4 class='date-header'>(" + moment().add(momentIndex, 'd').format('L') + ")</h4><br><br><img src='" + forecastLink + "' alt='weather-icon'><br><br><p class='description'>" + data.daily[i].weather[0].description + "</p>Temp: " + data.daily[i].temp.day + " F<br>Humidity: " + data.daily[i].humidity + "%";
        newColumn.appendChild(newColumnInterior);
        forecastContainerEl.appendChild(newColumn);
    }

    resultMainEl.appendChild(forecastContainerEl);


};
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



function saveSearch() {
    localStorage.setItem("weatherArray", JSON.stringify(weatherArray));
    console.log("search recorded");
}

function loadSearch() {
    var savedSearches = JSON.parse(localStorage.getItem("weatherArray"));

    if (savedSearches) {
        weatherArray = savedSearches;
        var string = "";
        var historyDivEl = document.getElementById("history-section");
        for (var i = 0; i < weatherArray.length; i++) {
            string += weatherArray[i] + " ";
            console.log(weatherArray[i]);
        }
        historyDivEl.innerHTML = string;
    } else { return false; }
    console.log("Search History Found...");
    weatherArray = JSON.parse(JSON.stringify(savedSearches));
    console.log(weatherArray);

}

loadSearch();
setInterval(function() {
    window.location.reload();
}, 30 * 60000);
// Saving
// Loading
// History