<template>
    <div>
        <router-view/>
    </div>
</template>

<script>

    import store from '@/store';

    export default {
        name: 'master-layout',
        computed: {
            profile() {
                return this.$store.getters.profile;
            }
        },
        beforeRouteEnter: (to, from, next) => {
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
                    .loadProfile(accessToken);
            } else {
                loadUserProfilePromise = new Promise(resolve => {
                    resolve(null);
                });
            }

            loadUserProfilePromise
                .then((profile) => {
                    store.commit('addProfile', profile);
                    next();
                });
        }
    }
</script>

<style scoped>

</style>