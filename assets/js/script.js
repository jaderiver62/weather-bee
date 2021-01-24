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

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                getWeather(data, input);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

var getWeather = function(data, searchTerm) {
    // check if api returned any repos
    console.log(data);
    var latEl = data.results[0].geometry.lat;
    var lngEl = data.results[0].geometry.lng;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lngEl + "&appid=3812ea6836536b0581712ffd66f54fa5&units=imperial";

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
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
    searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    var capitalizeTerms = searchTerm.split(" ");

    for (var i = 0; i < capitalizeTerms.length; i++) {
        capitalizeTerms[i] = capitalizeTerms[i][0].toUpperCase() + capitalizeTerms[i].substr(1);
    }
    searchTerm = capitalizeTerms.join(" ");

    var resultMainEl = document.getElementById("search-result-container");
    resultMainEl.setAttribute("style", "border: 1px solid black; padding: 10px 10px; display: inline-block;");
    var resultTopDivEl = document.createElement("div");
    resultTopDivEl.className = "container";
    resultTopDivEl.setAttribute("style","padding: 10px; display: flex;");
    
    var textDivEl= document.createElement('div');
    textDivEl.className = "text";

    var imageDivEl = document.createElement('div');
    imageDivEl.className = "image";

    var myIconEl = document.createElement('img');
    // myIconEl.setAttribute("style","padding: 0;");

    var iconIdEl = data.current.weather[0].icon;
    var link = "http://openweathermap.org/img/wn/" + iconIdEl + "@2x.png";
    myIconEl.src = link;
    
    resultTopDivEl.className = "top-result d-flex justify-contents-around";
    var textDivHeadingEl = document.createElement('div');
    textDivHeadingEl.className = "text";
    textDivHeadingEl.innerHTML = "<h2>" + searchTerm + "  (" + moment().format('L') + ") </h2>";

    var textDivContentEl =document.createElement('div');
    textDivContentEl.className = "text";
    textDivContentEl.innerHTML = "<br><br><br><h5>Temperature: " + data.current.temp + " F<br><br>Humidity: "+ data.current.humidity +"%<br><br>Wind Speed: "+ data.current.wind_speed + " MPH<br><br>UV Index: " + data.current.uvi + "</h5>";

    textDivEl.appendChild(textDivHeadingEl);
    textDivEl.appendChild(textDivContentEl);
    
    imageDivEl.appendChild(myIconEl);

    resultTopDivEl.appendChild(textDivEl);
    resultTopDivEl.appendChild(imageDivEl);
    resultMainEl.appendChild(resultTopDivEl);

    console.log(data);

};
