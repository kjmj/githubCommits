Vue.component('v-select', VueSelect.VueSelect);

var githubCommits = new Vue({
  el: '#githubCommits',
  data: {
    branches: [''],
    currentBranch: '',
    commits: '',
    userMessage: '',
    repoURL: '',
    apiURL: ''
  },
  watch: {
    currentBranch: 'getCommits'
  },
  filters: {
    truncate: function (v) {
      let newline = v.indexOf('\n');
      return newline > 0 ? v.slice(0, newline) : v;
    },
    formatDate: function (v) {
      return v.replace(/T|Z/g, ' ');
    }
  },
  methods: {
    // try to query the given github repo string
    tryRepoQuery: function() {
      let self = this
      self.queryRepo()
    },
    // try to parse repo info from given string into an api call
    parseURL: function() {
      let self = this
      self.apiURL = self.repoURL.replace('github.com', 'api.github.com/repos')
      console.log(self.apiURL)
    },
    // query github api, check response codes and act accordingly
    queryRepo: function() {
      let self = this;

      self.makeRequest(self.apiURL)
      .then(function (response) {
        // github api limit was hit
        if(response.status === 403) {
          self.userMessage = 'You have likely hit your github api call limit. Please see https://developer.github.com/v3/#rate-limiting for more info'
          return
        }
        // invalid url
        if(response.status === 404) {
          self.userMessage = 'Could not find that repo. Please make sure it exists'
          return
        }

        // valid request, so get repo info
        self.getDefaultBranch();
        self.getBranches();
        self.getCommits();
      })
      .catch(function (error) {
        console.log('Error checking valid repo', error);
      });
    },
    // get the default branch of the given github repo
    getDefaultBranch: function() {
      let self = this;

      self.makeRequest(self.apiURL)
          .then(function (response) {
            self.currentBranch = JSON.parse(response.responseText).default_branch;
          })
          .catch(function (error) {
            console.log('Error fetching default branch: ', error);
          });
    },
    // get all the branches of the given github repo
    getBranches: function () {
      let self = this;
      let queryString = '/branches';

      self.makeRequest(self.apiURL + queryString)
          .then(function (response) {
            self.branches = JSON.parse(response.responseText).map(x => x.name);
          })
          .catch(function (error) {
            console.log('Error fetching branches: ', error);
          });
    },
    // get the commits of the given github repo
    getCommits: function () {
      let self = this;
      let queryString = '/commits?per_page=4&sha=';

      self.makeRequest(self.apiURL + queryString + self.currentBranch)
          .then(function (response) {
            self.commits = JSON.parse(response.responseText);
          })
          .catch(function (error) {
            console.log('Error fetching commits: ', error);
          });
    },
    // async helper function to make a XMLHttpRequest. returns a promise
    makeRequest: function (url) {
      let xhr = new XMLHttpRequest();

      return new Promise(function (resolve, reject) {
        xhr.onload = function () {
          resolve(xhr);
        };

        xhr.onerror = function () {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };

        xhr.open('GET', url, true);
        xhr.send();
      });
    }
  }
});