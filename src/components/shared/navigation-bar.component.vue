<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span
                        class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
                <a class="navbar-brand" href="javascript:void(0);">Personal CV</a>
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

                    <li v-if="!profile">
                        <a href="javascript:void(0);" v-on:click="vOnSignInClicked()">Sign in</a>
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
            EventBus.$emit('eventClickSignIn');
        }

        /*
        * Called when sign out button is clicked.
        * */
        public vOnSignOutClicked(): void{
            EventBus.$emit('eventClickSignOut');
        }

        //#endregion
    }

</script>

<style scoped>

</style>