<template>
    <div>
        <div class="row">
            <div class="col-lg-3">
                <router-view name="adminSideBar"/>
            </div>
            <div class="col-lg-9">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class ManagementLayoutComponent extends Vue {

    }

</script>

<style scoped>

</style>