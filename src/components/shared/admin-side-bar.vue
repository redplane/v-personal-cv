<template>
    <ul class="nav nav-pills nav-stacked">
        <router-link to="/management/user-management"
                     tag="li"
                     active-class="active"
                     v-bind:role="'presentation'">
            <a href="javascript:void(0);">User management</a>
        </router-link>
        <router-link to="/management/responsibility-management"
                     tag="li"
                     active-class="active"
                     v-bind:role="'presentation'">
            <a href="javascript:void(0);">Responsibility management</a>
        </router-link>
        <router-link to="/management/skill-management"
                     tag="li"
                     active-class="active"
                     v-bind:role="'presentation'">
            <a href="javascript:void(0);">Skill management</a>
        </router-link>
    </ul>
</template>

<script>
    export default {
        name: 'admin-side-bar'
    }
</script>

<style scoped>

</style>