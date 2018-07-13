// Import bootstrap framework style.
import '../node_modules/bootstrap3/dist/css/bootstrap.css';

// Import JQuery lib.
import 'expose-loader?$!expose-loader?jQuery!jquery';
import '@babel/polyfill';

// Import bootstrap code.
import '../node_modules/bootstrap3/dist/js/bootstrap.js';

// Import bootstrap lib.
import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';

const injector = require('vue-inject/dist/vue-inject');
Vue.use(injector);

const uiv = require('uiv');
Vue.use(uiv);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
