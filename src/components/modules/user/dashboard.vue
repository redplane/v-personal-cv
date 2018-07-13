<template>

    <div>
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
                    <button class="btn btn-info"
                            v-on:click="vOnUserClicked(user)">
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
                        <button class="btn btn-primary"
                                v-on:click="vOnAddUserClicked()">
                            <i class="glyphicon glyphicon-plus"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

        <modal :header="false"
               :footer="false"
               size="lg"
               v-model="bIsUserModalOpened"
               v-if="bIsUserModalOpened">
            <div slot="default">
                <user-detail :p-user="user"
                             v-on:confirm="addEditUser(user)"
                             v-on:cancel="bIsUserModalOpened = false"></user-detail>
            </div>
        </modal>

    </div>
</template>

<script>

    import UserDetail from './user-detail.vue';

    export default {
        name: 'user-dashboard',
        dependencies: ['$user'],
        components: {
            UserDetail
        },
        data() {
            return {
                self: this,
                users: [],
                user: {},
                bIsUserModalOpened: false
            }
        },
        methods: {
            vOnUserClicked(user) {
                this.user = user;
                this.bIsUserModalOpened = true;
            },
            vOnAddUserClicked() {
                this.user = {};
                this.bIsUserModalOpened = true;
            },

            /*
            * Event which is fired when user is added/edited.
            * */
            addEditUser(user) {

                // Promise to be completed.
                let promise = null;

                if (!user.id) {
                    promise = this
                        .$user
                        .addUser(user)
                        .then(() => {
                            console.log('Added user');
                        });
                } else {
                    promise = this
                        .$user
                        .editUser(user.id, user)
                        .then(() => {
                            console.log('Edited user');
                        });
                }

                promise
                    .then(() => {
                        // Close the modal dialog.
                        this.bIsUserModalOpened = false;
                    })
            }
        },
        mounted() {

            const self = this;

            // Get users list.
            this.$user.getUser()
                .then((loadUserResult) => {
                    self.users = loadUserResult.records;
                })
        }
    }
</script>

<style scoped>

    .modal-body {
        background-color: black !important;
    }
</style>