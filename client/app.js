const socket = io()
const app = new Vue({
  el: '#yelp-search',
  data: {
    cuisine: '',
    location: '',
  },
  methods: {
    searchFoods: function() {
      if (!this.location)
        return

      socket.emit('search-foods', {cuisine: this.cuisine, location: this.location})
    }
  },
})

socket.on('successful-search', terms => {
  console.log(terms)
})
