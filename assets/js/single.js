// Global variables
var issueContainerEl = document.querySelector("#issues-container");



var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass the response data to DOM function
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
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


getRepoIssues("cmuscari/taskinator");