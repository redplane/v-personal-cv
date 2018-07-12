<template>
    <div class="row">
        <div class="col-lg-3">
            <router-view name="adminSideBar"/>
        </div>
        <div class="col-lg-9">
            <router-view/>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'master-layout'
    }
</script>

<style scoped>

</style>