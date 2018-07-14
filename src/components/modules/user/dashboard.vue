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
                    <button class="btn btn-danger"
                            v-on:click="vOnDeleteUserClick(user)">
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

        <!--Add/edit user-->
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

        <!--Delete user-->
        <modal :header="false"
               v-model="bIsDeleteUserModalOpened"
               v-if="bIsDeleteUserModalOpened">
            <div slot="default">
                <div class="text-center">
                    <i class="text-danger">Are you sure to delete</i>&nbsp;<b class="text-danger">{{user.firstName}}
                    {{user.lastName}}</b>&nbsp;<i class="text-danger">from the system</i>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            v-on:click="deleteUserResponse(user)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            v-on:click="bIsDeleteUserModalOpened = false">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </modal>

    </div>
</template>

<script>

    import UserDetail from './user-detail.vue';

    export default {
        name: 'user-dashboard',
        dependencies: ['$user', '$toastr'],
        components: {
            UserDetail
        },
        data() {
            return {
                self: this,
                users: [],
                user: {},
                bIsUserModalOpened: false,
                bIsDeleteUserModalOpened: false
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

            vOnDeleteUserClick(user) {
                this.user = user;
                this.bIsDeleteUserModalOpened = true;
            },

            /*
            * Event which is fired when user is added/edited.
            * */
            addEditUser(user) {

                // Promise to be completed.
                let promise = null;
                let self = this;

                if (!user.id) {
                    promise = this
                        .$user
                        .addUser(user)
                        .then(() => {
                            self.$toastr.success('User has been added');
                        });
                } else {
                    promise = this
                        .$user
                        .editUser(user.id, user)
                        .then(() => {
                            self.$toastr.success('User has been edited');
                        });
                }

                promise
                    .then(() => {
                        // Close the modal dialog.
                        this.bIsUserModalOpened = false;
                    })
            },

            /*
            * Event which is fired when user is deleted.
            * */
            deleteUserResponse(user) {
                // Get context.
                let self = this;
                this.$user
                    .deleteUser(user.id)
                    .then(() => {
                        self.$toastr.success('User has been deleted from the system');
                        self.bIsDeleteUserModalOpened = false;
                    });
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