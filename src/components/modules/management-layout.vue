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

<script>

    import store from '@/store';

    export default {
        name: 'management-layout',
        computed: {
            profile() {
                return this.$store.getters.profile;
            }
        }
    }
</script>

<style scoped>

</style>