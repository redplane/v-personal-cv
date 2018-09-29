<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">

    import store from '@/store';
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter} from "vuex-class";
    import {Route} from "vue-router";
    import {Profile} from "@/models/profile";
    import {User} from "@/models/user";

    @Component({
        name: 'master-layout'
    })
    export default class MasterLayoutComponent extends Vue {

        //#region Properties

        @Getter('profile', {namespace: 'app'})
        public profile: Profile;

        @Action('loadProfile', {namespace: 'apiUser'})
        private loadProfileAsync: (id: number | null) => Promise<User>;

        //#endregion

        //#region Events

        /*
        * Called before route is entered.
        * */
        public beforeRouteEnter(to: Route, from: Route, next: () => void) {
            // Import vuex store.
            const injector = require('vue-inject/dist/vue-inject');
            const lsAppAccessToken = injector.get('lsAppAccessToken');
            const localStorage = injector.get('$localStorage');

            // Promise to be resolved.
            let loadUserProfilePromise = null;

            // Get access token from storage.
            let accessToken = localStorage.getItem(lsAppAccessToken);
            if (accessToken) {
                loadUserProfilePromise = this.loadProfileAsync(0);
            } else {
                loadUserProfilePromise = new Promise(resolve => {
                    resolve();
                });
            }

            loadUserProfilePromise
                .then((profile: any) => {
                    store.commit('addProfile', profile);
                    next();
                });
        }

        //#endregion
    }
</script>

<style scoped>

</style>