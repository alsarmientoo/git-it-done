var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var formSubmmitHandler = function(event) {
    event.preventDefault();
    // console.log(event);
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
};

var displayRepos = function(repos, searchTerm) {
    console.log(repos);
    console.log(searchTerm);

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;


    // loop over repos, to display repository data to the page
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    

    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold a repository name
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
        "<i class = 'fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
        statusEl.innerHTML = "<i class = 'fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container 
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
    };
};

var getUserRepos = function(user) {
    // console.log("function was called");
    // fetch("https://api.github.com/users/octocat/repos").then(function(response) {
    //     response.json().then(function(data) {
            // console.log(data);
    //     });
    // });
    // fetch the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
        // console.log(response);
        // if request was successful
        if (response.ok) {
        // response.json to make response an object array
            response.json().then(function(data) {
                displayRepos(data, user);
                // console.log(data);
            });
        } else {
            alert("Error: Github User Not Found");
        }
    })
    .catch(function(error) {
        // notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to Github");
    });
};    

userFormEl.addEventListener("submit", formSubmmitHandler);
// getUserRepos("user");