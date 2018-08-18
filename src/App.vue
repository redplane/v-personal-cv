<template>
    <div id="app">

        <!--BlockUI layer-->
        <BlockUI :message="blockUi.message"
                 :html="blockUi.html"
                 v-if="blockUi && blockUi.available"></BlockUI>

        <navigation-bar/>

        <div class="container-fluid">
            <div class="col-lg-12">
                <router-view/>
            </div>
        </div>

        <!--Login modal dialog-->
        <modal :header="false"
               :footer="false"
               size="md"
               v-model="bIsLoginModalAvailable"
               v-if="bIsLoginModalAvailable"
               class="replace-body">
            <div slot="default">
                <login-box v-on:click-login="vOnSignIn($event)"
                           v-on:click-cancel="vOnCancelSignIn()">
                </login-box>
            </div>
        </modal>
    </div>
</template>

<script>

    // Import toastr style.

    import NavigationBar from './components/shared/navigation-bar'
    import LoginBox from './components/shared/login-box';

    import {EventBus} from '@/event-bus'
    import { mapState, mapMutations } from 'vuex'
    import store from '@/store'

    export default {
        dependencies: ['lsAppAccessToken', '$user', '$toastr', '$localStorage', 'eventConstant'],
        components: {
            NavigationBar,
            LoginBox
        },
        computed:{
            ...mapState(
                [
                    'blockUi'
                ]
            )
        },
        data() {
            return {
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
            vOnSignIn(loginModel) {

                // Declare access token.
                let accessToken = null;
                let self = this;

                // Block app UI.
                self.addLoadingScreen();

                self.$user
                    .login(loginModel)
                    .then((loginResult) => {
                        // Add to access token to local storage.
                        accessToken = loginResult.accessToken;
                        // Attach access token to local storage.
                        self.$localStorage.setItem(self.lsAppAccessToken, accessToken);

                        return self.$user
                            .loadProfile(null);
                    })
                    .then((profile) => {
                        self.$store.commit('addProfile', profile);


                        // Display success message.
                        self.$toastr.success('Login successfully.');

                        // Close login modal.
                        self.bIsLoginModalAvailable = false;

                        // Trigger application event that login is successfully.
                        EventBus.emit(self.eventConstant.loginSuccess);
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
