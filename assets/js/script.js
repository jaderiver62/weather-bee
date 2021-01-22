var searchBtn = document.getElementById("btn");

var searchHandler= function(event) {
    event.preventDefault();
    var inputContent = document.getElementById("citySelection").value;
    document.getElementById("search-result-container").innerHTML = "Hello World: "+ inputContent;
  };
searchBtn.addEventListener("click", searchHandler);
