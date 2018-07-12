<template>
    <table class="table table-condensed table-responsive">
        <thead>
        <tr>
            <th></th>
            <th class="text-center">Full name</th>
            <th class="text-center">Birthday</th>
            <th class="text-center">Role</th>
            <th class="text-center"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="users && users.length"
            v-for="user in users">
            <td></td>
            <td class="text-center">{{user.firstName}} {{user.lastName}}</td>
            <td class="text-center">{{user.birthday}}</td>
            <td class="text-center">{{user.role}}</td>
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
        <tr v-if="!users || !users.length">
            <td colspan="5"
                class="text-center">
                <i class="text-danger">No information is available.</i>
            </td>
        </tr>
        <tr>
            <td colspan="5">
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
        name: 'user-dashboard',
        data() {
            return {
                users: []
            }
        },
        mounted() {

            this.users = [
                {
                    fullName: 'Full name 01',
                    birthday: 0,
                    role: 'Full-stack developer'
                }
            ];
        }
    }
</script>

<style scoped>

</style>