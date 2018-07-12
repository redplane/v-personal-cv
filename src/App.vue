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
    import {Component, Vue} from 'vue-property-decorator';
    import NavigationBar from './components/shared/navigation-bar';
    import SideBar from './components/shared/side-bar';

    @Component({
        components: {
            NavigationBar
        },
    })

    export default class App extends Vue {
    }
</script>

<style lang="scss">
</style>
