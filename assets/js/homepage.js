// Global variables
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");




// Form submit handler function to be executed on form submission
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    // if a value is entered, use it in the getUserRepos function & clear the input.  If nothing was entered, show alert
    if (username) {
        getUserRepos(username);
        nameInputEl.value - "";
    }
    else {
        alert("Please enter a GitHub username");
    }
};


// Request the user repo from the server
var getUserRepos = function(user) {
    // format the github url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            // send the data into the displayRepos function
            displayRepos(data, user);
        });
    });
}


// Display repos function
var displayRepos = function(repos, searchTerm) {
    // clear old content
    repoContainerEl.textContent = "";

    // create new variable that stores the text content of the search
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
  
    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
  
    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
  
    // append to container
    repoEl.appendChild(titleEl);
    
  
    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }

    console.log(repos);
    console.log(searchTerm);
};








// Event listener for submit button on form
userFormEl.addEventListener("submit", formSubmitHandler);
