<template>
    <table class="table table-condensed table-responsive">
        <thead>
        <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Created time</th>
            <th class="text-center">Last modified time</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="responsibilities && responsibilities.length"
            v-for="responsibility in responsibilities">
            <td class="text-center">{{responsibility.name}}</td>
            <td class="text-center">{{responsibility.createdTime}}</td>
            <td class="text-center">{{responsibility.lastModifiedTime}}</td>
            <td class="text-center">
                <button class="btn btn-info">
                    <i class="glyphicon glyphicon-pencil"></i>
                </button>
                <span>&nbsp;</span>
                <button class="btn btn-danger">
                    <i class="glyphicon glyphicon-remove"></i>
                </button>
            </td>
        </tr>
        <tr v-if="!responsibilities || !responsibilities.length">
            <td colspan="4"
                class="text-center">
                <i class="text-danger">No information is available.</i>
            </td>
        </tr>
        <tr>
            <td colspan="4">
                <div class="pull-right">
                    <button class="btn btn-primary">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: 'responsibility-dashboard',
        data() {
            return {
                responsibilities: []
            }
        },
        mounted(){
            this.responsibilities = [
                {
                    id: 1,
                    name: 'Responsibility 01',
                    createdTime: 0,
                    lastModifiedTime: 0
                },
                {
                    id: 2,
                    name: 'Responsibility 02',
                    createdTime: 0,
                    lastModifiedTime: 0
                }
            ]
        }
    }
</script>

<style scoped>

</style>