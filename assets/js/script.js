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
// 33.441792-94.037689&exclude=hourly,daily&appid=3812ea6836536b0581712ffd66f54fa5    
var getWeather = function(data, searchTerm) {
    // check if api returned any repos
    console.log(data);
    var latEl = data.results[0].geometry.lat;
    var lngEl = data.results[0].geometry.lng;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lngEl + "&appid=3812ea6836536b0581712ffd66f54fa5";

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

    for (let i = 0; i < capitalizeTerms.length; i++) {
        capitalizeTerms[i] = capitalizeTerms[i][0].toUpperCase() + capitalizeTerms[i].substr(1);
    }
    searchTerm = capitalizeTerms.join(" ");

    var resultMainEl = document.getElementById("search-result-container");
    resultMainEl.setAttribute("style", "border: 1px solid black; padding: 10px 10px; display: inline-grid;");
    var resultTopDivEl = document.createElement("div");
    var myIconEl = document.createElement('img');
    var weatherIconCode = data.current.weather[0].icon;
    myIconEl.src = "http://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png";
    resultTopDivEl.className = "top-result";
    resultTopDivEl.innerHTML = "<h3>" + searchTerm + "  (" + moment().format('L') + ") ";
    resultTopDivEl.appendChild(myIconEl);
    resultMainEl.appendChild(resultTopDivEl);

    console.log(data);
    /* 10d */
};
var getIcon = function(iconNumber) {
    /*    if (iconNumber === )*/

};