// Import bootstrap framework style.
import '../node_modules/bootstrap3/dist/css/bootstrap.css';

// Import JQuery lib.
import 'expose-loader?$!expose-loader?jQuery!jquery';

// Import bootstrap code.
import '../node_modules/bootstrap3/dist/js/bootstrap.js';

// Import bootstrap lib.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
