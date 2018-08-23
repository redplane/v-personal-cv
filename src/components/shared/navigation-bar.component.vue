<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span
                        class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
                <router-link class="navbar-brand"
                   :to="{name: 'default'}">Personal CV</router-link>
            </div>

            <div class="collapse navbar-collapse"
                 id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown"
                        v-if="profile">
                        <a href="javascript:void(0);"
                           class="dropdown-toggle"
                           data-toggle="dropdown"
                           role="button"
                           aria-haspopup="true"
                           aria-expanded="false">{{profile.firstName}} {{profile.lastName}} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li v-on:click="vOnSignOutClicked()">
                                <a href="javascript:void(0);">Sign out</a>
                            </li>
                        </ul>
                    </li>

                    <li class="dropdown"
                        v-else>
                        <a href="javascript:void(0);"
                           class="dropdown-toggle"
                           data-toggle="dropdown"
                           role="button"
                           aria-haspopup="true"
                           aria-expanded="false">Anonymous <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li @click="vOnSignInClicked()">
                                <a href="javascript:void(0);" >Sign in</a>
                            </li>
                            <li @click="vOnRegisterClicked()">
                                <a href="javascript:void(0);">Register</a>
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">

    import {EventBus} from '@/event-bus.ts'
    import {Vue, Component} from 'vue-property-decorator'
    import {Profile} from "../../models/profile"
    import {Getter} from 'vuex-class'
    const EventConstant = require('../../constants/event.constant.ts').EventConstant;

    @Component({
        name: 'navigation-bar'
    })
    export default class NavigationBarComponent extends Vue {

        //#region Properties

        /*
        * Profile state.
        * */
        @Getter('profile')
        public profile: Profile;

        //#endregion

        //#region Methods

        /*
        * Called when Sign In button is clicked.
        * */
        public vOnSignInClicked(): void {
            EventBus.$emit(EventConstant.clickSignIn);
        }

        /*
        * Called when sign out button is clicked.
        * */
        public vOnSignOutClicked(): void{
            EventBus.$emit(EventConstant.clickSignOut);
        }

        /*
        * Called when register button is clicked
        * */
        public vOnRegisterClicked(): void{
            EventBus.$emit(EventConstant.clickRegister);
        }

        //#endregion
    }

</script>

<style scoped>

</style>