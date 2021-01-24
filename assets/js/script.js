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
    

    
    resultMainEl.setAttribute("style", "border: 1px solid black; padding: 10px 10px; display: inline-block;");

    var resultTopDivEl = document.createElement("div");
    
    resultTopDivEl.className = "container";
    resultTopDivEl.setAttribute("style","padding: 10px; display: flex;");
    resultTopDivEl.className = "top-result d-flex justify-contents-around";
    
    var textDivEl= document.createElement('div');
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

    var textDivContentEl =document.createElement('div');
    textDivContentEl.className = "text";
    textDivContentEl.innerHTML = "<p class='description'>" + data.current.weather[0].description + "</p><br><br><br><h5>Temperature: " + data.current.temp + " F<br><br>Humidity: " + data.current.humidity + "%<br><br>Wind Speed: " + data.current.wind_speed + " MPH<br><br>UV Index: " + "<span class='badge bg-primary text-light'>" + data.current.uvi + "</span></h5>";

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
var createForecast = function(data){
    var forecastContainerEl = document.createElement('div');
    forecastContainerEl.className = "container forecast col-12 col-xs-12 col-sm-12 col-lg-8 col-xl-8"
    forecastContainerEl.innerHTML = "<h3>5-Day Forecast</h3>";
    var forecastRowEl = document.createElement('div');
    forecastRowEl.className = "row";
    for(var i=0; i<5; i++){
        var newColumn = document.createElement('div');
        newColumn.className="col col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2 justify-content-between";
        
        newColumn.setAttribute("style", "text-align: center; color: white; padding:0; min-height: 150px; background-color: indigo; min-width: 140px; border: 10px solid white; ");
        var newColumnInterior = document.createElement('div');
        newColumnInterior.className = "col";
        newColumnInterior.innerHTML = "(" + moment().add(1, 'd').format('L') + ")<br><br>" + data.daily[i].weather[0].description;
        newColumn.appendChild(newColumnInterior);
        forecastRowEl.appendChild(newColumn);
    }
    forecastContainerEl.appendChild(forecastRowEl);
    resultMainEl.appendChild(forecastContainerEl);

}
// Saving
// Loading
// History

