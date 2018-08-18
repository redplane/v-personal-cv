<template>
    <div>

        <!--User search result-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
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
                        <tr v-if="users"
                            v-for="user in users">
                            <td></td>
                            <td class="text-center">{{user.firstName}} {{user.lastName}}</td>
                            <td class="text-center">{{user.birthday}}</td>
                            <td class="text-center">{{user.role}}</td>
                            <td class="text-center">
                                <router-link tag="button"
                                             class="btn btn-default"
                                             :to="{ name: 'about-me', params: { userId: user.id, user: user }}">
                                    <span class="glyphicon glyphicon-comment"></span>
                                </router-link>
                                <span v-if="bIsAbleToEditUser">&nbsp;</span>
                                <button class="btn btn-info"
                                        v-on:click="vOnUserClicked(user)"
                                        v-if="bIsAbleToEditUser">
                                    <i class="glyphicon glyphicon-pencil"></i>
                                </button>
                                <span v-if="bIsAbleToDeleteUser">&nbsp;</span>
                                <button class="btn btn-danger"
                                        v-on:click="vOnDeleteUserClick(user)"
                                        v-if="bIsAbleToDeleteUser">
                                    <i class="glyphicon glyphicon-remove"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="5"
                                class="text-center">
                                <i class="text-danger">No information is available.</i>
                            </td>
                        </tr>
                        <tr v-if="bIsAbleToAddUser">
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
                </div>
            </div>
        </div>

        <!--Pagination-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <pagination v-model="loadUsersCondition.pagination.page"
                                :total-page="totalPage"
                                align="center"
                                :boundary-links="true"
                                :direction-links="true"
                                @change="vOnLoadUserPageChange($event)">
                    </pagination>
                </div>
            </div>
        </div>

        <!--Add/edit user-->
        <modal :header="false"
               :footer="false"
               size="lg"
               v-model="bIsUserModalOpened"
               v-if="bIsUserModalOpened"
               class="replace-body">
            <div slot="default">
                <user-detail :user-property="user"
                             v-on:confirm="addEditUser($event)"
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
                            v-on:click="deleteUser(user)">
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

    import UserDetail from '../user/user-detail.component.vue';
    import {mapMutations} from 'vuex';

    export default {
        name: 'user-dashboard',
        dependencies: ['$user', '$ui', '$toastr', 'paginationConstant', 'userRoleConstant'],
        components: {
            UserDetail
        },
        data() {
            return {

                /*
                * User search condition.
                * */
                loadUsersCondition: {
                    pagination: {
                        page: 1,
                        records: this.paginationConstant.dashboardMaxItem
                    }
                },

                /*
                * User search result.
                * */
                loadUsersResult: {
                    records: [],
                    total: 0
                },

                self: this,
                user: {},
                bIsUserModalOpened: false,
                bIsDeleteUserModalOpened: false
            }
        },
        computed: {

            /*
            * Loaded users list.
            * */
            users() {
                if (!this.loadUsersResult || !this.loadUsersResult.records || this.loadUsersResult.total < 1)
                    return [];

                return this.loadUsersResult.records
            },

            /*
            * User profile (who is using website)
            * */
            profile() {
                return this.$store.getters.profile;
            },

            /*
            * Check whether user is able to delete user or not.
            * */
            bIsAbleToDeleteUser() {
                // Profile is not defined.
                if (!this.profile)
                    return false;

                if (this.profile.role !== this.userRoleConstant.admin)
                    return false;

                return true;
            },

            /*
            * Check whether user is able to edit user or not.
            * */
            bIsAbleToEditUser() {
                if (!this.profile)
                    return false;

                if (this.profile.role !== this.userRoleConstant.admin)
                    return false;

                return true;
            },

            /*
            * Check whether user is able to add another user or not.
            * */
            bIsAbleToAddUser() {
                if (!this.profile)
                    return false;

                if (this.profile.role !== this.userRoleConstant.admin)
                    return false;

                return true;
            },

            /*
            * Calculate total page to display on the screen.
            * */
            totalPage(){
                let self = this;
                return self.$ui.loadPageCalculation(self.loadUsersResult.total, self.loadUsersCondition.pagination.records)
            }
        },
        methods: {

            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Called when user is clicked.
            * */
            vOnUserClicked(user) {
                this.user = user;
                this.bIsUserModalOpened = true;
            },

            /*
            * Called when add user button is clicked.
            * */
            vOnAddUserClicked() {
                this.user = {};
                this.bIsUserModalOpened = true;
            },

            /*
            * Called when delete user is clicked.
            * */
            vOnDeleteUserClick(user) {
                this.user = user;
                this.bIsDeleteUserModalOpened = true;
            },

            /*
            * Called when user is searched.
            * */
            vOnLoadUserPageChange() {
                let self = this;

                // Add loading screen.
                self.addLoadingScreen();

                // Load users using existing conditions.
                self.loadUsers()
                    .then((loadUsersResult) => {
                        self.loadUsersResult = loadUsersResult;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Event which is fired when user is added/edited.
            * */
            addEditUser(user) {

                // Promise to be completed.
                let promise = null;
                let self = this;

                // Block app ui.
                self.addLoadingScreen();

                if (!user.id) {
                    promise = self
                        .$user
                        .addUser(user)
                        .then(() => {
                            self.$toastr.success('User has been added');
                        });
                } else {
                    promise = self
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
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Event which is fired when user is deleted.
            * */
            deleteUser(user) {
                // Get context.
                let self = this;

                // Block screen.
                self.addLoadingScreen();

                this.$user
                    .deleteUser(user.id)
                    .then(() => {
                        self.$toastr.success('User has been deleted from the system');
                        self.bIsDeleteUserModalOpened = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Load users base on specific conditions.
            * */
            loadUsers() {

                // Get current context.
                let self = this;

                // Get users list.
                return self.$user
                    .loadUsers(self.loadUsersCondition)
                    .catch(() => {
                        return {
                            records: [],
                            total: 0
                        }
                    });
            }
        },
        mounted() {
            const self = this;
            self.addLoadingScreen();

            // Display loading screen.
            self.addLoadingScreen();

            // Get users list.
            self.loadUsers()
                .then((loadUsersResult) => {
                    self.loadUsersResult = loadUsersResult;
                })
                .finally(() => {
                    self.deleteLoadingScreen();
                });
        }
    }
</script>

<style scoped>
</style>