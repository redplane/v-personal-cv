<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid"><!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span
                        class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
                <a class="navbar-brand" href="javascript:void(0);">Personal CV</a></div>
        </div>
    </nav>
</template>

<script>
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class NavigationBar extends Vue {
    }

</script>

<style scoped>

</style>