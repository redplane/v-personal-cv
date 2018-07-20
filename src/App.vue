<template>
    <div id="app">

        <!--BlockUI layer-->
        <BlockUI :message="blockUI.message"
                 :html="blockUI.html"
                 v-if="blockUI && blockUI.available"></BlockUI>

        <navigation-bar/>

        <div class="container-fluid">
            <div class="col-lg-12">
                <router-view/>
            </div>
        </div>

        <!--Login modal dialog-->
        <modal size="md"
               v-model="bIsLoginModalAvailable"
               v-if="bIsLoginModalAvailable">
            <div slot="header">
                <h3 class="panel-title">Login</h3>
            </div>
            <div slot="default">
                <div class="row">
                    <div class="col-lg-3">
                        <label>User</label>
                    </div>
                    <div class="col-lg-9">
                        <div class="form-group">
                            <input class="form-control" v-model="user.email"/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-3">
                        <label>Password</label>
                    </div>
                    <div class="col-lg-9">
                        <div class="form-group">
                            <input class="form-control" type="password" v-model="user.password"/>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-primary"
                            v-on:click="vOnSignIn()">
                        <span>Login</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            v-on:click="vOnCancelSignIn()">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

    // Import toastr style.

    import NavigationBar from './components/shared/navigation-bar'
    import {EventBus} from '@/event-bus'
    import { mapState, mapMutations } from 'vuex'
    import store from '@/store'

    export default {
        dependencies: ['lsAppAccessToken', '$user', '$toastr', '$localStorage'],
        components: {
            NavigationBar
        },
        computed:{
            ...mapState(
                [
                    'blockUI'
                ]
            )
        },
        data() {
            return {
                user: {
                    email: null,
                    password: null
                },
                bIsLoginModalAvailable: false
            }
        },
        mounted() {

            // Get current function context.
            let self = this;

            /*
            * Called when sign in button is clicked.
            * */
            EventBus.$on('eventClickSignIn', () => {

                // Profile is valid. Ignore this event.
                let profile = self.profile;
                if (profile)
                    return;

                // Clear information.
                self.user.email = null;
                self.user.password = null;

                self.bIsLoginModalAvailable = true;
            });

            /*
            * Called when sign out button is clicked.
            * */
            EventBus.$on('eventClickSignOut', () => {
                // Clear the access token.
                self.$localStorage.removeItem(self.lsAppAccessToken);

                // Clear profile from vuex.
                store.commit('deleteProfile');
                console.log('Sign out button is clicked');
            })

        },
        methods: {

            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Called when sign in confirm button is clicked.
            * */
            vOnSignIn() {

                // Declare access token.
                let accessToken = null;
                let self = this;

                // Block app UI.
                self.addLoadingScreen();

                self.$user
                    .login(this.user.email, this.user.password)
                    .then((loginResult) => {
                        // Add to access token to local storage.
                        accessToken = loginResult.accessToken;

                        return self.$user
                            .loadProfile(accessToken);
                    })
                    .then((profile) => {
                        self.$store.commit('addProfile', profile);
                        // Attach access token to local storage.
                        self.$localStorage.setItem(self.lsAppAccessToken, accessToken);

                        // Display success message.
                        self.$toastr.success('Login successfully.');

                        // Close login modal.
                        self.bIsLoginModalAvailable = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    })

            },

            /*
            * Called when sign in operation is cancelled by user.
            * */
            vOnCancelSignIn() {
                this.bIsLoginModalAvailable = false;
            }
        }
    }
</script>

<style lang="scss">
</style>
