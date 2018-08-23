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

<script lang="ts">

    // Import toastr style.

    import NavigationBar from './components/shared/navigation-bar.component'
    import LoginBox from './components/shared/login-box.component';

    import {EventBus} from '@/event-bus'
    import {mapState, mapMutations} from 'vuex'
    import store from '@/store'

    import {Component, Vue} from 'vue-property-decorator';
    import {Getter, Mutation, State} from "vuex-class";
    import {Profile} from "./models/profile";
    import {LoginViewModel} from "./view-model/user/login.view-model";

    const GlobalConstant = require('./constants/global.constant.ts').GlobalConstant;
    const EventConstant = require('./constants/event.constant.ts').EventConstant;

    @Component({
        dependencies: ['$user', '$toastr', '$localStorage'],
        components: {
            NavigationBar,
            LoginBox
        }
    })
    export default class AppComponent extends Vue {

        //#region Properties

        // Block UI instance.
        @State('blockUi')
        private blockUi: any;

        // Profile information.
        @Getter('profile')
        private profile: Profile;

        // Whether login modal is available or not.
        private bIsLoginModalAvailable: boolean = false;

        //#endregion

        //#region Constructor

        public constructor() {
            super();

        }

        //#endregion

        //#region Methods

        @Mutation('addLoadingScreen')
        private addLoadingScreen: any;

        @Mutation('deleteLoadingScreen')
        private deleteLoadingScreen: any;

        //#endregion

        //#region Events

        public mounted(): void {
            /*
            * Called when sign in button is clicked.
            * */
            EventBus.$on('eventClickSignIn', () => {

                // Profile is valid. Ignore this event.
                let profile = this.profile;
                if (profile)
                    return;

                this.bIsLoginModalAvailable = true;
            });

            /*
            * Called when sign out button is clicked.
            * */
            EventBus.$on('eventClickSignOut', () => {
                // Clear the access token.
                this.$localStorage.removeItem(GlobalConstant.accessTokenKey);

                // Clear profile from vuex.
                store.commit('deleteProfile');
            })
        }

        /*
        * Called when sign in confirm button is clicked.
        * */
        public vOnSignIn(loginModel: LoginViewModel): void {

            // Declare access token.
            let accessToken = null;

            // Block app UI.
            this.addLoadingScreen();

            this.$user
                .login(loginModel)
                .then((loginResult) => {
                    // Add to access token to local storage.
                    accessToken = loginResult.accessToken;
                    // Attach access token to local storage.
                    this.$localStorage.setItem(GlobalConstant.accessTokenKey, accessToken);
                    return this.$user
                        .loadProfile(null);
                })
                .then((profile) => {
                    this.$store.commit('addProfile', profile);


                    // Display success message.
                    this.$toastr.success('Login successfully.');

                    // Close login modal.
                    this.bIsLoginModalAvailable = false;

                    // Trigger application event that login is successfully.
                    EventBus.$emit(EventConstant.loginSuccessful);
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })

        }

        /*
        * Called when sign in operation is cancelled by user.
        * */
        public vOnCancelSignIn(): void {
            this.bIsLoginModalAvailable = false;
        }

        //#endregion
    }
</script>

<style lang="scss">
</style>
