import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        profile: null
    },
    getters: {
        profile: (state: any) => state.profile
    },
    mutations: {
        addProfile: (state: any, profile: any) => {
            state.profile = profile
        },
        deleteProfile: (state) => {
            state.profile = null;
        }
    }
})
