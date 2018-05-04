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
            </center>
          </div>
          <div class="card-body center-block">
            <center>
            <details>
              <span>{{restaurant.location.address1}}, {{restaurant.location.city}}, {{restaurant.location.state}} {{restaurant.location.zip_code}}</span>
              <span>{{restaurant.phone}}</span>
              <p>Reviews: {{restaurant.review_count}}</p>
              <p>{{restaurant.price}}
                <span v-for="category in restaurant.categories">
                  - {{category.title}}
                </span>
              </p>
              <button v-on:click='searchReviews(restaurant)' class="btn btn-primary" type="submit">Reviews</button>
              </details>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  props: ['results'],
  methods: {
    searchReviews(restaurant){
      // if (this.results.length == 0) {return}
      console.log('running searchReviews')
      this.$parent.searchReviews(restaurant)
      // socket.emit('search-reviews', restaurant)
    },
  },
};

const reviewsComponent = {
  template: `
  <div class="container">
    <div class="jumbotron">
    <center>
     <img class="rounded" :src=selected.image_url height="300px" width="300px">
     <h2>{{selected.name}}</h2>
     <h5>{{selected.location.address1}}</h4>
     <h5>{{selected.location.city}}, {{selected.location.state}} {{selected.location.zip_code}}</br> {{selected.phone}} </h4>
     <h6>Price Range: {{selected.price}}</h6>
    </center>
    </div>
    <div class="jumbotron" style="margin-bottom:2px;">
      <ul>
        <li v-for="review in reviews">{{review.text}}</li>
      </ul>
    </div>
  </div>
  `,
  props:['reviews','selected']
}

const socket = io();
const app = new Vue({
  el: '#yelp-search',
  data: {
    cuisine: '',
    location: '',
    results: [],
    selected: {},
    history: [],
    reviews: []
  },
  methods: {
    searchFoods() {
      if (!this.location) { return; }
      socket.emit('search-foods', { cuisine: this.cuisine, location: this.location })
    },
    searchReviews(restaurant){
      // if (this.results.length == 0) {return}
      app.selected  = restaurant 
      console.log(`running search on ${app.selected.name}`)
      socket.emit('search-reviews', app.selected.id)
    },
  },
  components: {
    'results-component': resultsComponent,
    'reviews-component': reviewsComponent
  }
});

socket.on('successful-search', (terms) => {
  app.results = terms
  app.reviews = []
  //console.log(app.results)
  console.log("business search finished!")
});

socket.on('successful-reviews', (reviewData) =>{
  app.reviews = reviewData
  app.results = []
  console.log(app.selected)
  reviewData.forEach(review =>{
    console.log('REVIEW DATA: ' + review.text)    
  })
})
