const resultsComponent = {
  //TODO: WORK ON THIS
  template: `<div>
              <h1>please work</h1>
              <p v-for='results in searchResults'>
                <span>{{results.name}}</span>
              </p>
            </div>`,
  props: ['searchResults']
}

const socket = io()
const app = new Vue({
  el: '#yelp-search',
  data: {
    cuisine: '',
    location: '',
    searchResults: []
  },
  methods: {
    searchFoods: function() {
      if (!this.location)
        return

      socket.emit('search-foods', {cuisine: this.cuisine, location: this.location})
    }
  },
  components: {
    'results-component': resultsComponent
  }
})

socket.on('successful-search', terms => {
  // console.log(terms)
  // app.searchResults.push(terms)
  // console.log(app.searchResults)
  // for (results in terms) {
  //   console.log(results)
  //   app.searchResults.push(results)
  // }
  // console.log(app.searchResults)
})
