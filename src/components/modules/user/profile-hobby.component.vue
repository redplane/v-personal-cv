<template>
    <div>
        <div class="panel panel-info">
            <div class="panel-heading clearfix" v-if="bIsAbleToEditProfile">
                <div class="btn-group pull-right" role="group">
                    <button type="button"
                            class="btn btn-info dropdown-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                        <span class="fa fa-bars"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li @click="vOnAddUserHobbyClicked()">
                            <a href="javascript:void(0);">Add hobby</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="panel-body">

                <!--User descriptions-->
                <div class="form-group">
                    <table class="table table-condensed table-striped">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Description</th>
                            <th class="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="hobby in hobbies">
                            <td class="text-center">{{hobby.name}}</td>
                            <td class="text-center">
                                <div v-html="hobby.description"></div>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-info"
                                        v-if="bIsAbleToEditProfile"
                                        @click="vOnEditHobbyClicked(hobby)">
                                    <span class="fa fa-edit"></span>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-danger"
                                        v-if="bIsAbleToEditProfile"
                                        @click="vOnDeleteHobbyClicked(hobby)">
                                    <span class="fa fa-trash"></span>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <!--Pagination-->
                <div class="form-group">
                    <div class="text-center">
                        <div class="form-group">
                            <pagination v-model="loadHobbyCondition.pagination.page"
                                        :total-page="totalPage"
                                        :boundary-links="true"
                                        size="sm"
                                        @change="vOnPaginationChange()">
                            </pagination>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!--Add/edit user hobby-->
        <modal :header="false"
               :footer="false"
               v-if="bIsAddEditUserHobbyModalAvailable"
               v-model="bIsAddEditUserHobbyModalAvailable"
               class="replace-body">
            <div slot="default">
                <user-hobby-detail :user-hobby-detail-property="oSelectedUserHobby"
                                   @cancel="bIsAddEditUserHobbyModalAvailable = false"
                                   @ok="addEditUserHobby"></user-hobby-detail>
            </div>
        </modal>

        <!--Delete user hobby-->
        <modal v-if="bIsDeleteUserHobbyModalAvailable"
               v-model="bIsDeleteUserHobbyModalAvailable"
               class="replace-body">
            <div slot="header">
                <b>Delete user hobby confirmation</b>
            </div>
            <div slot="default">
                <div class="text-center">
                    <b class="text-danger">Are you sure to delete this hobby ?</b>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            @click="deleteUserHobby(oSelectedUserHobby)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="bIsDeleteUserHobbyModalAvailable = false">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Getter, Action, Mutation} from 'vuex-class'
    import {cloneDeep} from 'lodash';

    // Import components
    import {Profile} from "../../../models/profile";
    import {UserRoles} from "../../../enumerations/user-role.enum";
    import {LoadHobbyViewModel} from "../../../view-model/hobby/load-hobby.view-model";
    import {SearchResult} from "../../../models/search-result";
    import {Hobby} from "../../../models/hobby";
    import {Prop} from "vue-property-decorator";
    import {Pagination} from "../../../models/pagination";
    import {PaginationConstant} from "../../../constants/pagination.constant";
    import {getTotalPage} from "../../../functions/get-total-page.function";

    import toastr from 'toastr';

    // Import components
    import UserHobbyDetail from './profile-hobby-editor.vue';

    @Component({
        components: {
            UserHobbyDetail
        }
    })
    export default class ProfileHobbyComponent extends Vue {

        //#region Properties

        @Prop(Number) private userIdProperty: number;

        /*
        * User profile which is using system.
        * */
        @Getter('profile', {namespace: 'app'})
        private profile: Profile;

        /*
        * Add loading screen to UI.
        * */
        @Mutation('addLoadingScreen', {namespace: 'app'})
        private addLoadingScreen: () => void;

        /*
        * Delete loading screen on UI.
        * */
        @Mutation('deleteLoadingScreen')
        private deleteLoadingScreen: () => void;

        /*
        * User id.
        * */
        private userId: number;

        /*
        * Load user hobby condition.
        * */
        private loadHobbyCondition: LoadHobbyViewModel = new LoadHobbyViewModel();

        /*
        * Load user hobby result.
        * */
        private loadHobbyResult: SearchResult<Hobby[]>;

        /*
        * Whether add/edit user hobby is available or not.
        * */
        private bIsAddEditUserHobbyModalAvailable: boolean = false;

        /*
        * Whether delete hobby is available or not.
        * */
        private bIsDeleteUserHobbyModalAvailable: boolean = false;

        /*
        * The selected user hobby for edit.
        * */
        private oSelectedUserHobby: Hobby = new Hobby();

        /*
        * Get hobbies list.
        * */
        public get hobbies(): Array<Hobby> {

            // No result is found.
            if (!this.loadHobbyResult)
                return new Array<Hobby>();

            return this.loadHobbyResult.records;
        }

        /*
        * Get total hobbies page.
        * */
        public get totalPage(): number {
            if (!this.loadHobbyResult)
                return 1;

            if (!this.loadHobbyCondition)
                return 1;

            return getTotalPage(this.loadHobbyResult.total, this.loadHobbyCondition.pagination.records);
        }

        /*
        * Check whether user is able to add user description or not.
        * */
        public get bIsAbleToEditProfile() {
            // Profile not found.
            if (!this.profile)
                return false;

            let profile = this.profile;
            if (!profile)
                return false;

            // Profile is not an admin.
            if (profile.role !== UserRoles.admin) {
                if (profile.id !== this.userId)
                    return false;
            }

            return true;
        }

        //#endregion

        //#region Constructor

        /*
        * Initialize component with settings.
        * */
        public constructor() {
            super();
            this.loadHobbyResult = new SearchResult<Hobby[]>();
            this.loadHobbyCondition = new LoadHobbyViewModel();

        }

        //#endregion

        //#region Methods

        @Action('loadHobbies')
        private loadHobbiesAsync: (conditions: LoadHobbyViewModel) => Promise<SearchResult<Hobby[]>>;

        @Action('editHobby')
        private editHobbyAsync: (hobby: Hobby) => Promise<Hobby>;

        @Action('addHobby')
        private addHobbyAsync: (hobby: Hobby) => Promise<Hobby>;

        @Action('editHobby')
        private deleteHobbyAsync: (id: number) => Promise<void>;


        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted() {
            this.loadHobbyResult = new SearchResult<Hobby[]>();
            this.loadHobbyCondition.pagination = new Pagination();
            this.loadHobbyCondition.pagination.records = PaginationConstant.dashboardMaxItem;

            // Add loading screen.
            this.addLoadingScreen();

            // Get user id.
            this.userId = this.userIdProperty;

            // Initialize loading condition.
            this.loadHobbyCondition.userIds = [this.userId];

            // Load user hobbies.
            this.loadHobbiesAsync(this.loadHobbyCondition)
                .then((loadHobbyResult: SearchResult<Hobby[]>) => {
                    this.loadHobbyResult = loadHobbyResult;
                    return loadHobbyResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })
        }

        /*
        * Called when add hobby is clicked.
        * */
        public vOnAddUserHobbyClicked(): void {
            let hobby: Hobby = new Hobby();
            hobby.id = 0;
            hobby.userId = this.userId;
            hobby.description = '';
            hobby.name = '';

            this.oSelectedUserHobby = hobby;
            this.bIsAddEditUserHobbyModalAvailable = true;
        }

        /*
        * On edit hobby clicked.
        * */
        public vOnEditHobbyClicked(hobby: Hobby): void {
            this.oSelectedUserHobby = hobby;
            this.bIsAddEditUserHobbyModalAvailable = true;
        };

        /*
        * On hobby is selected to be deleted.
        * */
        public vOnDeleteHobbyClicked(hobby: Hobby): void {
            this.oSelectedUserHobby = hobby;
            this.bIsDeleteUserHobbyModalAvailable = true;
        }

        /*
        * Called when pagination is changed.
        * */
        public vOnPaginationChange(): void {

            // Add loading screen.
            this.addLoadingScreen();

            this.loadHobbiesAsync(this.loadHobbyCondition)
                .then((loadHobbyResult: SearchResult<Hobby[]>) => {
                    this.loadHobbyResult = loadHobbyResult;
                    return loadHobbyResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })
        }

        /*
        * Called when user hobby is confirmed being edied.
        * */
        public addEditUserHobby(hobby: Hobby): void {
            if (!hobby)
                return;

            // Block screen access.
            this.addLoadingScreen();

            let pPromise = null;

            if (hobby.id) {
                pPromise = this
                    .editHobbyAsync(hobby)
                    .then(() => {
                        // Display the toastr notification.
                        toastr.success('Hobby has been added successfully.')
                    });
            } else {
                let addHobbyModel = new Hobby();
                addHobbyModel = cloneDeep(hobby);
                addHobbyModel.userId = this.userId;

                pPromise = this
                    .addHobbyAsync(addHobbyModel)
                    .then(() => {
                        // Display the toastr notification.
                        toastr.success('Hobby has been added successfully.')
                    });
            }

            pPromise
                .then(() => {
                    this.bIsAddEditUserHobbyModalAvailable = false;

                    // Reload the results.
                    return this
                        .loadHobbiesAsync(this.loadHobbyCondition)
                })
                .then((loadHobbyResult: SearchResult<Hobby[]>) => {
                    this.loadHobbyResult = loadHobbyResult;
                    return loadHobbyResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when delete hobby is confirmed.
        * */
        public deleteUserHobby(hobby: Hobby): void {
            // No hobby is selected
            if (!hobby || !hobby.id)
                return;

            // Add loading screen.
            this.addLoadingScreen();

            this.deleteHobbyAsync(hobby.id)
                .then(() => {
                    // Display success message.
                    toastr.success('Hobby has been deleted successfully.');

                    // Close modal.
                    this.bIsDeleteUserHobbyModalAvailable = false;
                    return true;
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