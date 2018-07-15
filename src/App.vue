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

    // Import toastr style.
    import '../node_modules/toastr/toastr.scss';

    import NavigationBar from './components/shared/navigation-bar';

    require('./services/lodash.service');
    require('./services/user.service');
    require('./services/skill.service');
    require('./services/toastr.service');
    require('./services/responsibility.service');
    require('./services/user-description.service');
    require('./services/hobby.service');
    require('./services/skill.service');
    require('./services/project.service');

    const injector = require('vue-inject/dist/vue-inject');
    injector.constant('baseUrl', 'http://2zxysdpz2bbbnaiby-mock.stoplight-proxy.io');

    // Import constants.
    const paginationConstant = require('./constants/pagination.constant');
    injector.constant('paginationConstant', paginationConstant);

    export default {
        dependencies: ['$user', '$toastr'],
        components: {
            NavigationBar
        },
        mounted(){
        }
    }
</script>

<style lang="scss">
</style>
