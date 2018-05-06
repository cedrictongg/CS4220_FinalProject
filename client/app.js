const resultsComponent = {
  template: `
  <div class="container text-center">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="restaurant in results">
        <div class="card" style="margin-top: 20px;">
          <div class="card-body">
            <p class="card-title"><strong>{{ restaurant.name }}</strong></p>
          </div>
          <div class="card-body center-block">
            <details>
            <summary><strong>Details</strong></summary>
            <br/>
            <div><img class="card-img-top" :src=restaurant.image_url height="180px" width="245px"></div>
            <br/>
            <div><img :src=restaurant.rating_url width="90%"></div>
            <br/>
            <p><strong>{{ restaurant.distance }}</strong></p>
              <p><strong>{{ restaurant.location }}</strong></p>
              <p><strong>{{ restaurant.phone }}</strong></p>
              <p><strong>Reviews: {{ restaurant.review_count }}</strong></p>
              <p><strong>{{ restaurant.categories }}</strong></p>
              <button v-on:click='searchReviews(restaurant)' class="btn btn-primary" type="submit">Reviews</button>
              </details>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  props: ['results'],
  methods: {
    searchReviews(restaurant) {
      // if (this.results.length == 0) {return}
      console.log('running searchReviews');
      this.$parent.searchReviews(restaurant);
      // socket.emit('search-reviews', restaurant)
    },
  },
};

const reviewsComponent = {
  template: `
  <div class="container">
    <div class="jumbotron">
    <div class="text-center">
     <img class="rounded" :src=selected.image_url height="300px" width="300px">
     <h2>{{selected.name}}</h2>
     <h5>{{selected.location}}</h4>
     <h6>{{selected.categories}}</h6>
    </div>
    </div>
    <div class="jumbotron" style="margin-bottom:2px;">
      <ul>
        <li v-for="review in reviews"><img class="rounded-circle" :src='review.user.image_url' height="75px" width="75px">{{review.text}}</li>
      </ul>
    </div>
  </div>
  `,
  props: ['reviews', 'selected'],
};

const historyComponent = {
  template: `<div class='nav flex-lg-column flex-row'>
               <ul class='list-unstyled' v-for='searches in history'>
                 <li>
                   <button type="button" class='list-group-item list-group-item-action' 
                   v-on:click='returnSearch(searches)'>
                   <strong>{{searches.cuisine}} in {{searches.location}} at {{searches.time}}</strong>
                   </button>
                 </li>
               </ul>
             </div>
            `,
  props: ['history'],
  methods: {
    returnSearch(redo) {
      socket.emit('redo-search', {
        cuisine: redo.cuisine,
        location: redo.location,
        limit: redo.limit,
      });
    },
  },
};

const socket = io();
const app = new Vue({
  el: '#yelp-search',
  data: {
    cuisine: '',
    location: '',
    limit: '',
    results: [],
    selected: {},
    history: [],
    reviews: [],
  },
  methods: {
    searchFoods() {
      if (!this.location) {
        return;
      }

      console.log('running searchFoods()');
      if (!this.limit) {
        this.limit = 5;
      }

      socket.emit('search-foods', {
        cuisine: this.cuisine,
        location: this.location,
        limit: this.limit,
      });
    },
    searchReviews(restaurant) {
      app.selected = restaurant;
      console.log(`running search on ${app.selected.name}`);
      socket.emit('search-reviews', app.selected.id);
    },
  },
  components: {
    'results-component': resultsComponent,
    'reviews-component': reviewsComponent,
    'history-component': historyComponent,
  },
});

socket.on('successful-search', (terms) => {
  app.results = terms;
  app.reviews = [];
  // console.log(app.results)
  console.log('business search finished!');
});

socket.on('successful-reviews', (reviewData) => {
  app.reviews = reviewData;
  app.results = [];
  // console.log(app.selected)
  // console.log(app.phimage)
  reviewData.forEach((review) => {
    console.log('REVIEW DATA: ' + review.text);
  });
});

socket.on('search-history', (searches) => {
  app.history = [];
  searches.forEach((items) => {
    if (!app.history.includes(items)) {
      app.history.push(items);
    }
  });
  console.log('current history: ' + app.history);
});
