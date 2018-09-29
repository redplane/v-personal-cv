<template>
    <ul class="nav nav-pills nav-stacked">
        <router-link to="/management/user-management"
                     tag="li"
                     active-class="active"
                     :role="'presentation'">
            <a href="javascript:void(0);">User management</a>
        </router-link>
        <router-link to="/management/responsibility-management"
                     tag="li"
                     active-class="active"
                     :role="'presentation'">
            <a href="javascript:void(0);">Responsibility management</a>
        </router-link>
        <router-link to="/management/skill-management"
                     tag="li"
                     active-class="active"
                     :role="'presentation'">
            <a href="javascript:void(0);">Skill management</a>
        </router-link>
    </ul>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component({
        name: 'admin-side-bar'
    })
    export default class AdminSideBarComponent extends Vue {

    }
</script>

<style scoped>

</style>