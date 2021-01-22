var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#form-input");
var resultContainerEl = document.querySelector("#search-result-container");
var citySearchTerm = document.querySelector("#history-section");

var formSubmitHandler = function(event) {

    event.preventDefault();


    var city = cityInputEl.value.trim();

    if (city) {
        getCityResult(city);


        resultContainerEl.textContent = "";
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
};


var getCityResult = function(cityEntry) {


    var apiUrl = "api.openweathermap.org/data/2.5/weather?q=" + cityEntry + "&appid=904649fff993603df4dffbb9fbb443f4";

    fetch(apiUrl)
        .then(function(response) {

            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayResults(data, cityEntry);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Open Weather Map");
        });
};


var displayResults = function(results, searchTerm) {
    if (results.length === 0) {
        resultContainerEl.textContent = "No such city found.";
        return;
    }

    citySearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < results.length; i++) {

        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        if (results[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + results[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        resultContainerEl.appendChild(statusEl);

    }
};

// add event listeners to form and button container
userFormEl.addEventListener("btn", formSubmitHandler);