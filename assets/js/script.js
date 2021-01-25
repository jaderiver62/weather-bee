var weatherArray = [];

var resultMainEl = document.getElementById("search-result-container");

var searchBtn = document.getElementById("btn");


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
        historyBtn.className = i + "-btn";
        historyBtn.setAttribute("value", entry);
        historyBtn.setAttribute("style", "width: 100%");
        historySearchEl.appendChild(historyBtn);
        historyList.appendChild(historySearchEl);
        historyBtn.addEventListener("click", historyBtnHandler);
    }
    historyDivEl.appendChild(historyList);

};

var historyBtnHandler = function(event) {
    event.preventDefault();
    var currentSearch = event.target.value;
    getCoordinates(currentSearch);
};

var searchHandler = function(event) {
    event.preventDefault();

    var inputContent = document.getElementById("citySelection").value;
    if (inputContent) {
        getCoordinates(inputContent);
    };


};
searchBtn.addEventListener("click", searchHandler);
var isDuplicate = function(entry) {
    for (var i = 0; i < weatherArray.length; i++) {
        if (entry === weatherArray[i]) {
            return true;
        }
    }
    return false;
};
var getCoordinates = function(input) {
    console.log(input);
    var apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" +
        input + "&key=974cf3d56a9f45d58e79a7ec8b1f7842";

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latEl + "&lon=" + lngEl + "&appid=3812ea6836536b0581712ffd66f54fa5&units=imperial";


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
    var checkDuplicate = isDuplicate(searchTerm);
    if (!checkDuplicate) {
        weatherArray.push(searchTerm);
        saveSearch();
    }
    createHistory();
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
    textDivContentEl.innerHTML = "<p class='description'>" + data.current.weather[0].description +
        "</p><br><h5>Temperature: " + data.current.temp + " F<br><br>Humidity: " + data.current.humidity +
        "%<br><br>Wind Speed: " + data.current.wind_speed + " MPH<br><br><br><div class='uv-i d-flex justify-contents-around'>UV Index:   &nbsp &nbsp" + uvBadgeElement + "</h5></div>";

    textDivEl.appendChild(textDivHeadingEl);
    textDivEl.appendChild(textDivContentEl);

    imageDivEl.appendChild(myIconEl);

    resultTopDivEl.appendChild(textDivEl);
    resultTopDivEl.appendChild(imageDivEl);
    resultMainEl.appendChild(resultTopDivEl);

    createForecast(data);

    console.log(data);

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
        newColumn.className = "new-column col-10 col-sm-6 col-md-6 col-lg-5 col-xl-2";

        newColumn.setAttribute("style", "text-align: center; padding:10px; color: white; height: 350px; border: 10px solid white; background-color: indigo; min-width: 230px;max-width: 230px;  margin: auto;");
        var newColumnInterior = document.createElement('div');
        newColumnInterior.className = "forecast-card p-3";
        newColumnInterior.innerHTML = "<h4 class='date-header'>(" + moment().add(momentIndex, 'd').format('L') +
            ")</h4><br><br><img src='" + forecastLink + "' alt='weather-icon'><br><br><p class='description'>" +
            data.daily[i].weather[0].description + "</p>Temp: " + data.daily[i].temp.day + " F<br>Humidity: " +
            data.daily[i].humidity + "%";
        newColumn.appendChild(newColumnInterior);
        forecastContainerEl.appendChild(newColumn);
    }

    resultMainEl.appendChild(forecastContainerEl);


};

function loadSearch() {
    var savedSearches = JSON.parse(localStorage.getItem("weatherArray"));

    if (savedSearches) {
        weatherArray = savedSearches;
    } else { return false; }
    console.log("Search History Found...");
    weatherArray = JSON.parse(JSON.stringify(savedSearches));
    createHistory();
};

loadSearch();
setInterval(function() {
    window.location.reload();
}, 30 * 60000);
// Saving
// Loading
// History