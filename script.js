let apiURL = "https://api.github.com/repos/kjmj/avocados/";
var githubCommits = new Vue({

  el: '#githubCommits',

  data: {
    branches: ['master'],
    currentBranch: 'master',
    commits: null
  },

  created: function () {
    this.fetchData()
  },

  watch: {
    currentBranch: 'fetchData'
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
    fetchData: function () {
      let xhr = new XMLHttpRequest();
      let self = this;
      let queryString = "commits?per_page=4&sha=";
      xhr.open('GET', apiURL + queryString + self.currentBranch);
      xhr.onload = function () {
        self.commits = JSON.parse(xhr.responseText);
      };
      xhr.send()
    }
  }
});