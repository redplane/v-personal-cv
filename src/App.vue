<template>
    <div id="app">
        <navigation-bar></navigation-bar>

        <div class="container-fluid">
            <div class="col-lg-12">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    import NavigationBar from './components/shared/navigation-bar';
    require('./services/user.service');

    const injector = require('vue-inject/dist/vue-inject');
    injector.constant('baseUrl', 'http://2zxysdpz2bbbnaiby-mock.stoplight-proxy.io');

    export default {
        dependencies: ['$user'],
        components: {
            NavigationBar
        },
        mounted(){
        }
    }
</script>

<style lang="scss">
</style>
