// Import bootstrap framework style.
import '../node_modules/bootstrap3/dist/css/bootstrap.css';

// Import toastr notification.
import '../node_modules/toastr/toastr.scss';
import 'vue-toastr/src/vue-toastr.scss';

// Import JQuery lib.
import 'expose-loader?$!expose-loader?jQuery!jquery';
import '@babel/polyfill';

// Import bootstrap code.
import '../node_modules/bootstrap3/dist/js/bootstrap.js';

// Import app style.
import '@/app.scss';

// Import bootstrap lib.
import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';

//#region Dependency injection

const vueInjector = require('vue-inject/dist/vue-inject');
// vueInjector.constant('baseUrl', 'http://2zxysdpz2bbbnaiby-mock.stoplight-proxy.io');
vueInjector.constant('baseUrl', 'http://localhost:35952');
vueInjector.constant('lsAppAccessToken', 'personal-cv.io');
vueInjector.constant('gCaptchaSiteKey', '6LfgV2gUAAAAACS_PGjH2iHJJwPXQGvEzP4FB83E');

// Import constants.
const paginationConstant = require('./constants/pagination.constant');
vueInjector.constant('paginationConstant', paginationConstant.default);

// Import user role constant.
const userRoleConstant = require('./constants/user-role.constant');
vueInjector.constant('userRoleConstant', userRoleConstant.default);

require('./services/promise-manager.service');
require('./services/local-storage.service');
require('./services/axios.service');
require('./services/toastr.service');
require('./services/ui.service');

Vue.use(vueInjector);

//#endregion

//#region Vue bootstrap

const uiv = require('uiv');
Vue.use(uiv);

//#endregion

//#region Vue blockUI

const BlockUI = require('vue-blockui');
import '../node_modules/vue-blockui/dist/vue-blockui.css';

Vue.use(BlockUI);

//#endregion

//#region Vue moment

Vue.use(require('vue-moment'));

//#endregion

//#region Font awesome
import '../node_modules/font-awesome/scss/font-awesome.scss';
//#endregion

//#region Croppa

const Croppa = require('vue-croppa');
Vue.use(Croppa);

//#endregion

//#region Vue editor

const VueTrumbowyg = require('vue-trumbowyg/dist/vue-trumbowyg.js');
import 'trumbowyg/dist/ui/trumbowyg.css';

Vue.use(VueTrumbowyg);

//#endregion

//#region Vue re-captcha

const VueGrecaptcha = require('vue-recaptcha');
Vue.use(VueGrecaptcha, {
    sitekey: 'your_key'
});

//#endregion


Vue.config.productionTip = false;


// Import vuex.
import store from './store';
import axios, {AxiosResponse} from 'axios';
import {AppSetting} from "@/models/app-setting";

axios.get('/app.config.json')
    .then((axiosResponse: AxiosResponse<AppSetting>) => {
        store.commit('addAppSetting', axiosResponse.data);

        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app');
    });





