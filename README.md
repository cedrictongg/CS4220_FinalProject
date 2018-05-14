Yelp Search v2
=====================

### Introduction

**Final Project for CS4220, Spring Semester 2018**

**Built with [Vue.js](https://vuejs.org/), using [Yelp](https://www.yelp.com/)'s services.**

#### Members:
* [Kevin Tong](https://github.com/kevintongg)
* [Cedric Tong](https://github.com/cedrictongg)
* [Daniel Kale](https://github.com/dkale29)
* [Maurice Mejia](https://github.com/thwips)
* [Christopher Ly](https://github.com/ly-c-christopher)

Uses the [Yelp Fusion API](https://www.yelp.com/fusion)'s [business endpoints](https://www.yelp.com/developers/documentation/v3/business) to search for content.


Getting Started
-------------

1. Create a `config.json` in the root directory with the following:
    ```json
    {
      "api_key": "Enter your API key here",
      "url_search": "https://api.yelp.com/v3/businesses/search",
      "url": "https://api.yelp.com/v3/businesses/"
    }
    ```
2. Go [here](https://www.yelp.com/developers/documentation/v3) to the Yelp Fusion portal to obtain an API key
3. Insert your API key into the `api_key` field

**Important: Install dependencies using `npm i` from root directory**

**You can run any of the following commands (from the root directory) to get up and running:**

* Run `node server/server.js`
* Using `nodemon` (detects file system changes and restarts the server automatically)
  * To install `nodemon`, run the following command: `node i -g nodemon`
* Using `live-server` (also detects file system changes and restarts the server automatically)
  * To install `live-server`, run the following command `node i -g live-server`
  
License
--------
See [LICENSE](https://github.com/cedrictongg/CS4220_FinalProject/blob/master/LICENSE) file.
