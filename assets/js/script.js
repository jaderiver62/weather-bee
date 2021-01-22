var searchBtn = document.getElementById("btn");

var searchHandler= function(event) {
    event.preventDefault();
    var resultEl = document.getElementById("search-result-container");
    var inputContent = document.getElementById("citySelection").value;
    if(inputContent){
        getWeather(inputContent);
        
    
  };
};
searchBtn.addEventListener("click", searchHandler);

var getWeather = function(input){
    console.log(input);
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid=3812ea6836536b0581712ffd66f54fa5";

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, input);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

var displayWeather = function(data, searchTerm) {
    // check if api returned any repos
    console.log(data);
    document.getElementById("search-result-container").textContent = searchTerm;

};



