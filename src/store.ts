import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        profile: null,
        blockUI: {
            available: false,
            html: '<i class="fa fa-cog fa-spin fa-3x fa-fw"></i>'
        }
    },
    getters: {
        profile: (state: any) => state.profile,
        blockUI: (state: any) => state.blockUI
    },
    mutations: {

        /*
        * Add profile to store.
        * */
        addProfile: (state: any, profile: any) => {
            state.profile = profile
        },

        /*
        * Delete profile from store.
        * */
        deleteProfile: (state) => {
            state.profile = null;
        },

        /*
        * Add loading screen with specific configuration.
        * */
        addLoadingScreen: (state: any, options: any) => {

            if (options) {
                ['message', 'html'].map((key) => {
                    if (!options[key])
                        return;

                    state.blockUI[key] = options[key];
                })
            }
            state.blockUI.available = true;
        },

        deleteLoadingScreen: (state: any) => {
            state.blockUI.available = false
        }
    }
})
