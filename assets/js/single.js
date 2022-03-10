// Global variables
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    
    // check if repo name is valid
    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    // if repo name was not given, redirect to the homepage
    else {
        document.location.replace("./index.html");
    }
};


var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass the response data to DOM function
                displayIssues(data);
                
                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        // if request was unsuccessful, redirect to homepage
        else {
            document.location.replace("./index.html");
        }
    });
}

var displayIssues = function(issues) {

    // check if there are issues, otherwise display a message in the issue container
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!"
        return;
    }
    // loop over the respose info
    for (var i=0; i < issues.length; i++) {
        // create a link element to take users to the issue on github (issuecontainer)
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append title span to issue container
        issueEl.appendChild(titleEl);

        // create span to hold issue type
        var typeEl = document.createElement("span");
        
        // check if issue type is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        }
        else {
            typeEl.textContent = "(Issue)";
        }

        // append type span to issue container
        issueEl.appendChild(typeEl);

        // append the issue container to main container on page 
        issueContainerEl.appendChild(issueEl);
    }

}


var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    
    // create new link element that link's to the GitHub url to display all issues
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append the new link to the warning container
    limitWarningEl.appendChild(linkEl);
};










getRepoName();