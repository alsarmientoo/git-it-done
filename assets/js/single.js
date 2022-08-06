var repoNameEl = document.querySelector("#repo-name");
var limitWarningEl = document.querySelector("#limit-warning");
var issueContainerEl = document.querySelector("#issues-container");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    // grab repo name from url query
    var queryString = document.location.search;

    var repoName = queryString.split("=")[1];
    console.log(repoName);
    
    if (repoName) {
        // if repoName exist, it will display reponame on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        // if no repo was give, redirect to the homepage
        document.location.replace("./index.html")
    };
};

var getRepoIssues = function(repo) {
    // to test if function is working
    // console.log(repo);

    // <repo> consists or username and repo name; direction=desc (descending) is the default
    // but this time we're making to asc (ascending), old issue first 
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // fetch is asynchronous, make a get request to url
    fetch(apiUrl).then(function(response) {
        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // console.log(data);
                // pass response data to dom function 
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    // console.log("repo has more than 30 issues");
                    displayWarning(repo);
                }
            });
        }
        else {
            // console.log(response);
            // alert("There was a problem with your request!")
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }

    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!"
        return;
    }
    
    // loop over given issues
    for (var i = 0; i <issues.length; i++) {
        // create a link element to take users to the issues on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        // target = _blank to open the link in a new tab instead of opening in current page
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title 
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span")

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)"
        }

        // append to container
        issueEl.appendChild(typeEl);

        // append to the dom
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // create a link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();