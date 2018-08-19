<template>
    <ul class="nav nav-pills nav-stacked">
        <router-link to="/about-me"
                     tag="li"
                     active-class="active"
                     v-bind:role="'presentation'">
            <a href="javascript:void(0);">About me</a>
        </router-link>
        <router-link to="/personal-project"
                     tag="li"
                     active-class="active"
                     v-bind:role="'presentation'">
            <a href="javascript:void(0);">Projects I have done</a>
        </router-link>
        <router-link to="/personal-technique"
                     tag="li"
                     active-class="active"
                     v-bind:role="'presentation'">
            <a href="javascript:void(0);">Techniques I have used</a>
        </router-link>
    </ul>
</template>

<script>
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'side-bar'})
    export default class SideBarComponent extends Vue {

    }

</script>

<style scoped>

</style>