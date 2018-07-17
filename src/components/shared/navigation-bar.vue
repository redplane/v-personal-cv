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
                        <a href="javascript:void(0);" v-on:click="vOnSigninClicked()">Sign in</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>

    import {EventBus} from '@/event-bus.ts'

    export default {
        name: 'navigation-bar',
        props: {},
        computed: {
            profile() {
                return this.$store.getters.profile;
            }
        },
        methods: {
            vOnSigninClicked() {
                EventBus.$emit('eventClickSignIn');
            },

            /*
            * Called when sign out button is clicked.
            * */
            vOnSignOutClicked(){
                EventBus.$emit('eventClickSignOut');
            }
        }
    }

</script>

<style scoped>

</style>