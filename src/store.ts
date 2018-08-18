import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
Vue.use(Vuex);

import {AppState} from "@/stores/app/app.state";

import {actions} from "@/stores/app/app.action";
import {mutations} from "@/stores/app/app.mutation";
import {getters} from "@/stores/app/app.getter";
import {BlockUiOption} from "@/models/block-ui-option";

export const state: AppState = {
    profile: null,
    blockUi: new BlockUiOption()
};

const namespaced: boolean = true;

const store: StoreOptions<AppState> = {
    state,
    getters,
    actions,
    mutations
};

export default new Vuex.Store<AppState>(store);