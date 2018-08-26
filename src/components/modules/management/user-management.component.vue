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

<script lang="ts">

    import UserDetail from '../user/user-detail.component.vue';
    import {Component, Vue} from 'vue-property-decorator'
    import {Mutation, State} from "vuex-class";
    import {Profile} from "../../../models/profile";
    import {UserRoles} from "../../../enumerations/user-role.enum";
    import {User} from "../../../models/user";
    import {SearchResult} from "../../../models/search-result";
    import {LoadUserViewModel} from "../../../view-model/user/load-user.view-model";
    import {Pagination} from "../../../models/pagination";
    const PaginationConstant = require('../../../constants/pagination.constant.ts').PaginationConstant;

    @Component({
        components: {
            UserDetail
        },
        dependencies: ['$lodash', '$user', '$ui']
    })
    export default class UserManagementComponent extends Vue {

        //#region Properties

        // Profile information.
        @State('profile')
        private profile: Profile;

        // User information.
        private user: User;

        // Whether user is opened or not.
        private bIsUserModalOpened: boolean = false;

        // Whether user delete modal is opened or not.
        private bIsDeleteUserModalOpened: boolean = false;

        // Load user result.
        private loadUsersResult: SearchResult<User[]>;

        // Load user condition.
        private loadUsersCondition: LoadUserViewModel;

        // Check whether profile can delete user or not.
        public get bIsAbleToDeleteUser(): boolean {
            // Profile is not defined.
            if (!this.profile)
                return false;

            if (this.profile.role !== UserRoles.admin)
                return false;

            return true;
        }

        // Loaded users list.
        public get users(): User[] {
            if (!this.loadUsersResult || !this.loadUsersResult.records || this.loadUsersResult.total < 1)
                return [];

            return this.loadUsersResult.records
        }

        // Check whether user is able to edit user or not.
        public get bIsAbleToEditUser(): boolean {
            if (!this.profile)
                return false;

            if (this.profile.role !== UserRoles.admin)
                return false;

            return true;
        }

        /*
        * Check whether user is able to add another user or not.
        * */
        public get bIsAbleToAddUser(): boolean {
            if (!this.profile)
                return false;

            if (this.profile.role !== UserRoles.admin)
                return false;

            return true;
        }

        /*
        * Calculate total page to display on the screen.
        * */
        public get totalPage(): number {
            // No pagination setting.
            if (!this.loadUsersCondition)
                return 1;

            let pagination: Pagination = this.loadUsersCondition.pagination;
            if (pagination == null || pagination.records < 1)
                return 1;

            if (!this.loadUsersResult)
                return 1;

            let loadUsersResult = this.loadUsersResult;
            if (loadUsersResult.total < 1)
                return 1;

            return this.$ui
                .loadPageCalculation(loadUsersResult.total, pagination.records)
        }

        //#endregion

        //#region Constructor

        /*
        * Called when component is initialized successfully.
        * */
        public constructor() {
            super();
            this.user = new User();
            this.loadUsersResult = new SearchResult<User[]>();
            this.loadUsersCondition = new LoadUserViewModel();

            // Initialize pagination.
            let pagination = new Pagination();
            pagination.page = 1;
            pagination.records = PaginationConstant.dashboardMaxItem;
            this.loadUsersCondition.pagination = pagination;
        }

        //#endregion

        //#region Methods

        // Add loading screen to UI.
        @Mutation('addLoadingScreen')
        private addLoadingScreen: any;

        // Delete
        @Mutation('deleteLoadingScreen')
        private deleteLoadingScreen: any;

        //#endregion

        //#region Events

        // Called when user is clicked.
        public vOnUserClicked(user: User): void {
            this.user = user;
            this.bIsUserModalOpened = true;
        }

        /*
        * Called when add user button is clicked.
        * */
        public vOnAddUserClicked(): void {
            this.user = new User();
            this.bIsUserModalOpened = true;
        }

        /*
        * Called when delete user is clicked.
        * */
        public vOnDeleteUserClick(user: User): void {
            this.user = this.$lodash.clone(user);
            this.bIsDeleteUserModalOpened = true;
        }

        /*
        * Event which is fired when user is added/edited.
        * */
        public addEditUser(user: User): void {

            // Promise to be completed.
            let promise = null;

            // Block app ui.
            this.addLoadingScreen();

            if (!user.id) {
                promise = this
                    .$user
                    .addUser(user)
                    .then(() => {
                        this.$toastr.success('User has been added');
                    });
            } else {
                promise = this
                    .$user
                    .editUser(user.id, user)
                    .then(() => {
                        this.$toastr.success('User has been edited');
                    });
            }

            promise
                .then(() => {
                    // Close the modal dialog.
                    this.bIsUserModalOpened = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Event which is fired when user is deleted.
        * */
        public deleteUser(user: User): void {

            // Block screen.
            this.addLoadingScreen();

            this.$user
                .deleteUser(user.id)
                .then(() => {
                    this.$toastr.success('User has been deleted from the system');
                    this.bIsDeleteUserModalOpened = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Load users base on specific conditions.
        * */
        public loadUsers(): any {

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

        /*
        * Called when user is searched.
        * */
        public vOnLoadUserPageChange(): void {

            // Add loading screen.
            this.addLoadingScreen();

            // Load users using existing conditions.
            this.loadUsers()
                .then((loadUsersResult) => {
                    this.loadUsersResult = loadUsersResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {
            // Add loading screen to UI.
            this.addLoadingScreen();

            // Get users list.
            this.loadUsers()
                .then((loadUsersResult: SearchResult<User[]>) => {
                    this.loadUsersResult = loadUsersResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        //#endregion
    }
</script>

<style scoped>
</style>