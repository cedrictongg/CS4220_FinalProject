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
            <div><img :src="'/rating/' + restaurant.rating +'.png'" width="90%"></div>
            <br/>
            <p><strong>{{ (restaurant.distance * 0.001).toFixed(2) }} km</strong></p>
              <div>
              <span><strong>{{ restaurant.location.address1 }}</strong></span>
              <br/>
              <span><strong>{{ restaurant.location.city }}, {{ restaurant.location.state }} {{ restaurant.location.zip_code }}</strong></span>
              <div/>
              <p><strong>{{ restaurant.phone }}</strong></p>
              <p><strong>Reviews: {{ restaurant.review_count }}</strong></p>
              <h6>
                <span>{{restaurant.price}}</span>
                <span v-for="category in restaurant.categories"> - {{category.title}}</span>
              </h6>
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
      console.log('running searchReviews');
      this.$parent.searchReviews(restaurant);
    },
  },
};

const reviewsComponent = {
  template: `
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-2"><img class="rounded" :src=selected.image_url width="100%"></div>
        <div class="col-10">
          <div class="text-center">
            <h2>{{selected.name}}</h2>
            <h5>{{selected.location.address1}} {{selected.location.address2}}<br>
            {{selected.location.city}}, {{selected.location.state}} {{selected.location.zip_code}}</h5><br>
            <h6>
              <span>{{selected.price}}</span>
              <span v-for="category in selected.categories"> - {{category.title}}</span>
            </h6>
          </div>
        </div>
      </div>
    </div>
    <div class="jumbotron" style="margin-bottom:15px;" v-for="review in reviews">
      <div class="row">
        <div class="col-2"><img class="rounded-circle" :src='review.user.image_url' width="100%"></div>
        <div class="col-10">
          <h3>{{review.user.name}}</h3>
          <h4><strong>{{review.time_created}}</strong></h4>
          <h4>Rating: {{review.rating}} / 5</h4>
          <p>{{review.text}}</p>
          <a :href=review.url>Review Link</a>
        </div>
      </div>
    </div>
  </div>
  `,
  props: ['reviews', 'selected'],
};

const historyComponent = {
  template: `<div class='nav flex-lg-column flex-row'>
               <ul class='list-unstyled' v-for='searches in history.slice().reverse()'>
                 <li>
                   <button type="button" class='list-group-item list-group-item-action'
                   v-on:click='returnSearch(searches)'>
                   <strong>{{searches.cuisine}} in {{searches.location}}</strong>
                   </button>
                 </li>
               </ul>
             </div>
            `,
  props: ['history'],
  methods: {
    returnSearch(redo) {
      axios.get(`http://localhost:8080/api/search?term=${redo.cuisine}&location=${redo.location}&limit=${redo.limit}`).then(res => {
        app.results = res.data.businesses
        app.reviews = []
      })
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
      if (!this.limit) {
        this.limit = 5;
      }
      console.log('running searchFoods()');

      axios.get(`http://localhost:8080/api/search?term=${this.cuisine}&location=${this.location}&limit=${this.limit}`)
        .then((res) => {
          app.results = res.data.businesses;
          app.reviews = [];
        });

      const params = {
        cuisine: this.cuisine,
        location: this.location,
        limit: this.limit,
      };
      socket.emit('search-foods', params);
    },
    searchReviews(restaurant) {
      app.selected = restaurant;
      axios.get(`http://localhost:8080/api/reviews?id=${app.selected.id}`)
        .then((res) => {
          const data = res.data.reviews;
          data.forEach((review) => {
            if (review.user.image_url === null) {
              review.user.image_url = `http://via.placeholder.com/75?text=${review.user.name}`;
            }
          });
          app.reviews = data;
          app.results = [];
        });
    },
  },
  components: {
    'results-component': resultsComponent,
    'reviews-component': reviewsComponent,
    'history-component': historyComponent,
  },
});

socket.on('search-history', (searches) => {
  app.history = [];
  searches.forEach((items) => {
    if (!app.history.includes(items)) {
      app.history.push(items);
    }
  });
});
