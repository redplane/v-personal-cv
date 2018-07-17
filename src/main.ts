// Import bootstrap framework style.
import '../node_modules/bootstrap3/dist/css/bootstrap.css';

// Import toastr notification.
import '../node_modules/toastr/toastr.scss';

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

// Register DI service.
const injector = require('vue-inject/dist/vue-inject');
Vue.use(injector);

// Register UIV.
const uiv = require('uiv');
Vue.use(uiv);

Vue.config.productionTip = false;

const vueInjector = require('vue-inject/dist/vue-inject');
vueInjector.constant('baseUrl', 'http://2zxysdpz2bbbnaiby-mock.stoplight-proxy.io');
vueInjector.constant('lsAppAccessToken', 'personal-cv.io');

// Import constants.
const paginationConstant = require('./constants/pagination.constant');
vueInjector.constant('paginationConstant', paginationConstant.default);

// Import user role constant.
const userRoleConstant = require('./constants/user-role.constant');
vueInjector.constant('userRoleConstant', userRoleConstant.default);

require('./services/lodash.service');
require('./services/local-storage.service');
require('./services/axios.service');
require('./services/user.service');
require('./services/skill.service');
require('./services/toastr.service');
require('./services/responsibility.service');
require('./services/user-description.service');
require('./services/hobby.service');
require('./services/skill.service');
require('./services/project.service');

// Import vuex.
import store from './store';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
