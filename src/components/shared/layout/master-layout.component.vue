<template>
    <div>
        <router-view/>
    </div>
</template>

<script lang="ts">

    import store from '@/store';
    import {Component, Vue} from 'vue-property-decorator';
    import {Profile} from "../../../models/profile";
    import {Getter} from "vuex-class";

    @Component({
        name: 'master-layout'
    })
    export default class MasterLayoutComponent extends Vue {

        //#region Properties

        @Getter('profile')
        public profile: Profile;

        //#endregion

        //#region Events

        /*
        * Called before route is entered.
        * */
        public beforeRouteEnter(to, from, next){
            // Import vuex store.
            const injector = require('vue-inject/dist/vue-inject');
            const lsAppAccessToken = injector.get('lsAppAccessToken');
            const localStorage = injector.get('$localStorage');

            // Promise to be resolved.
            let loadUserProfilePromise = null;

            // Get access token from storage.
            let accessToken = localStorage.getItem(lsAppAccessToken);
            if (accessToken) {
                let $user = injector.get('$user');
                loadUserProfilePromise = $user
                    .loadProfile(null);
            } else {
                loadUserProfilePromise = new Promise(resolve => {
                    resolve(null);
                });
            }

            loadUserProfilePromise
                .then((profile: Profile) => {
                    store.commit('addProfile', profile);
                    next();
                });
        }

        //#endregion
    }
</script>

<style scoped>

</style>