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

<script>

    // Import vuex map
    import {mapMutations, mapGetters} from 'vuex';

    export default {
        name: 'profile',
        data() {
            return {
                user: {
                    id: 1
                }
            }
        },
        computed: {
            ...mapGetters([
                'profile'
            ])
        },
        methods:{
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ])
        }
    }
</script>

<style scoped>

</style>