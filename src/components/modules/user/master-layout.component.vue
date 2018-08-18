<template>
    <div class="row">
        <div class="col-lg-3">
            <ul class="nav nav-pills nav-stacked">
                <router-link tag="li"
                             role="presentation"
                             active-class="active"
                             :to="{name: 'about-me', param: {userIdProperty: user.id}}">
                    <a href>Summary</a>
                </router-link>
                <router-link tag="li"
                             role="presentation"
                             active-class="active"
                             :to="{name: 'user-hobby', param: {userIdProperty: user.id}}">
                    <a href>What I like</a>
                </router-link>
                <router-link tag="li"
                             role="presentation"
                             active-class="active"
                             :to="{name: 'user-project', param: {userIdProperty: user.id}}">
                    <a href>Project I have done</a>
                </router-link>
                <router-link tag="li"
                             role="presentation"
                             active-class="active"
                             :to="{name: 'user-skill', param: {userIdProperty: user.id}}">
                    <a href>Technique I have used</a>
                </router-link>
            </ul>
        </div>
        <div class="col-lg-9">
            <router-view :user-id-property="user.id"/>
        </div>
    </div>
</template>

<script lang="ts">

    // Import vuex map
    import {mapMutations, mapGetters} from 'vuex';
    import {Component, Vue} from 'vue-property-decorator';
    import Component from "vue-class-component";
    import {User} from "../../../models/user";
    import {Profile} from "../../../models/profile";
    import {Getter, Mutation} from "vuex-class";

    @Component
    export default class UserMasterLayoutComponent extends Vue {

        //#region Properties

        /*
        * User instance.
        * */
        private user: User;

        /*
        * Profile of person who is using system.
        * */
        @Getter('profile')
        private profile: Profile;

        //#endregion

        //#region Constructor

        /*
        * Initialize component with default settings.
        * */
        public constructor(){
            super();
            this.user = new User();
            this.user.id = 1;
        }

        //#endregion

        //#region Methods

        /*
        * Add loading screen.
        * */
        @Mutation('addLoadingScreen')
        public addLoadingScreen;

        /*
        * Delete loading screen.
        * */
        public deleteLoadingScreen;

        //#endregion
    }

</script>

<style scoped>

</style>