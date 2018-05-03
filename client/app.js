const resultsComponent = {
  // TODO: WORK ON THIS
  template: `
  <div class="container">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="restaurant in results">
        <div class="card" style="margin-top: 20px;">
          <img class="card-img-top" :src=restaurant.image_url height="180px" width="245px">
          <div class="card-body">
            <p class="card-title text-center">{{restaurant.name}}</p>
            <center>
              <img :src="'/rating/' + restaurant.rating +'.png'" width="90%"><br>
            </center></div><div class="card-body center-block"><center>
              <button v-on:click="" class="btn btn-primary" type="submit">
                Reviews
              </button>
            </center>
          </div>
        </div>
      </div>  
    </div>
  </div>`,
  props: ['results']
};

const socket = io();
const app = new Vue({
  el: '#yelp-search',
  data: {
    cuisine: '',
    location: '',
    results: [],
    selected: [],
    history: [],
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
  app.results = terms
  console.log(app.results)
});
