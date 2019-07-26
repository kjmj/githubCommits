let apiURL = "https://api.github.com/repos/kjmj/avocados/";
var githubCommits = new Vue({

  el: '#githubCommits',

  data: {
    branches: ['master'],
    currentBranch: 'master',
    commits: null
  },

  created: function () {
    this.getCommits()
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
    getCommits: function () {
      let self = this;
      let queryString = "commits?per_page=4&sha=";

      self.makeRequest(apiURL + queryString + self.currentBranch)
          .then(function (response) {
            self.commits = JSON.parse(response.responseText);
          })
          .catch(function (error) {
            console.log('Something went wrong', error);
          });
    },
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