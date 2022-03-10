// Global variables
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");




// Form submit handler function to be executed on form submission
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    // if a value is entered, use it in the getUserRepos function & clear the input.  If nothing was entered, show alert
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
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
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    // send the data into the displayRepos function
                    displayRepos(data, user);
                });
            }
            else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to GitHub");
        });
}


// Display repos function
var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories Found";
        return;
    }

    // clear old content
    repoContainerEl.innerHTML = "";

    // create new variable that stores the text content of the search
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
  
    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
  
    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
  
    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
    statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
    statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};




var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is: featured&sort=help-wanted-issues";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then (function(data) {
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: GitHub language not found");
        }
    });
};



var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
    

}



// Event listener for submit button on form
userFormEl.addEventListener("submit", formSubmitHandler);

// Event listener for submit button on language buttons
languageButtonsEl.addEventListener("click", buttonClickHandler);
