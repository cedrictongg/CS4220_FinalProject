const resultsComponent = {
  // TODO: WORK ON THIS
  template: '<span>{{ results }}</span>',
  props: ['results']
};

const socket = io();
const app = new Vue({
  el: '#yelp-search',
  data: {
    cuisine: '',
    location: '',
    results: [],
  },
  methods: {
    searchFoods() {
      if (!this.location) { return; }

      socket.emit('search-foods', { cuisine: this.cuisine, location: this.location });
    }
  },
  components: {
    'results-component': resultsComponent
  }
});

socket.on('successful-search', (terms) => {
  // console.log(terms)
  // app.searchResults.push(terms)
  // console.log(app.searchResults)
  terms.forEach((items) => {
    app.results.push(items);
  });
  console.log(app.results);
});
