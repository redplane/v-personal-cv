<template>
    <div>

        <!--Responsibilities list-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <table class="table table-condensed table-responsive">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Created time</th>
                            <th class="text-center">Last modified time</th>
                            <th v-if="bIsUserAdmin"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="responsibilities && responsibilities.length"
                            v-for="responsibility in responsibilities">
                            <td class="text-center">{{responsibility.name}}</td>
                            <td class="text-center">{{responsibility.createdTime}}</td>
                            <td class="text-center">{{responsibility.lastModifiedTime}}</td>
                            <td class="text-center"
                                v-if="bIsUserAdmin">
                                <button class="btn btn-info"
                                        v-on:click="vOnEditResponsibilityClicked(responsibility)">
                                    <i class="glyphicon glyphicon-pencil"></i>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-danger"
                                        v-on:click="vOnDeleteResponsibilityClick(responsibility)">
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
                                    <button class="btn btn-primary"
                                            v-on:click="vOnAddResponsibilityClicked()">
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

        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <pagination v-model="loadResponsibilitiesCondition.pagination.page"
                                :total-page="totalPage"
                                align="center"
                                :boundary-links="true"
                                :direction-links="true"
                                @change="vOnLoadResponsibilityPageChange($event)">
                    </pagination>
                </div>
            </div>
        </div>

        <!--Edit/add responsibility modal-->
        <modal :header="false"
               :footer="false"
               v-model="bIsResponsibilityDetailModalOpened"
               v-if="bIsResponsibilityDetailModalOpened"
               size="md"
               class="replace-body">
            <div slot="default">
                <responsibility-detail :responsibility-property="responsibility"
                                       v-on:confirm="addEditResponsibility($event)"
                                       v-on:cancel="bIsResponsibilityDetailModalOpened = false"/>
            </div>
        </modal>

        <!--Delete responsibility modal-->
        <modal :header="false"
               v-model="bIsDeleteResponsibilityModalOpened"
               v-if="bIsDeleteResponsibilityModalOpened"
               size="md">
            <div slot="default">
                <div class="text-center">
                    <span class="text-danger">Are you sure to delete <b>{{responsibility.name}}</b> from the system ?</span>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            v-on:click="deleteResponsibility(responsibility.id)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="bIsDeleteResponsibilityModalOpened = false">Cancel
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">

    // Import responsibility detail component.
    import ResponsibilityDetailComponent from '../responsibility/responsibility-detail.component.vue';
    import {Vue, Component} from 'vue-property-decorator'
    import {SearchResult} from "../../../models/search-result";
    import {Responsibility} from "../../../models/responsibility";
    import {LoadResponsibilityViewModel} from "../../../view-model/load-responsibility.view-model";
    import {Pagination} from "../../../models/pagination";
    import {Profile} from "../../../models/profile";
    import {Action, Getter, Mutation} from "vuex-class";
    import {PaginationConstant} from "../../../constants/pagination.constant";
    import {UserRoles} from "../../../enumerations/user-role.enum";

    import {getTotalPage} from "../../../functions/get-total-page.function";
    import toastr from 'toastr';


    @Component({
        components: {ResponsibilityDetailComponent}
    })
    export default class ResponsibilityManagementComponent extends Vue {

        //#region Properties

        // Profile information.
        @Getter('profile', {namespace: 'app'})
        private profile: Profile;

        @Action('addResponsibility', {namespace: 'apiResponsibility'})
        private addResponsibilityAsync: (responsibility: Responsibility) => Promise<Responsibility>;

        @Action('editResponsibility', {namespace: 'apiResponsibility'})
        private editResponsibilityAsync: (responsibility: Responsibility) => Promise<Responsibility>;

        @Action('deleteResponsibility', {namespace: 'apiResponsibility'})
        private deleteResponsibilityAsync: (id: number) => Promise<void>;

        @Action('loadResponsibilities', {namespace: 'apiResponsibility'})
        private loadResponsibilitiesAsync: (conditions: LoadResponsibilityViewModel) => Promise<SearchResult<Responsibility[]>>;

        // Load responsibilities result.
        private loadResponsibilitiesResult: SearchResult<Responsibility[]>;

        // Load responsibilities condition.
        private loadResponsibilitiesCondition: LoadResponsibilityViewModel;

        // Responsibility for information binding.
        private responsibility: Responsibility;

        // Whether responsibility detail modal is opened or not.
        private bIsResponsibilityDetailModalOpened: boolean = false;

        // Whether responsibility modal is opened or not.
        private bIsDeleteResponsibilityModalOpened: boolean = false;

        /*
        * List of responsibilities that loaded from api end-point.
        * */
        public get responsibilities(): Responsibility[] {
            if (!this.loadResponsibilitiesResult || !this.loadResponsibilitiesResult.records || this.loadResponsibilitiesResult.total < 1)
                return [];

            return this.loadResponsibilitiesResult.records;
        }

        /*
        * Calculate total page to display on the screen.
        * */
        public get totalPage(): number {
            // No pagination setting.
            if (!this.loadResponsibilitiesCondition)
                return 1;

            let pagination: Pagination = this.loadResponsibilitiesCondition.pagination;
            if (pagination == null || pagination.records < 1)
                return 1;

            if (!this.loadResponsibilitiesResult)
                return 1;

            let loadResponsibilitiesResult = this.loadResponsibilitiesResult;
            if (loadResponsibilitiesResult.total < 1)
                return 1;

            return getTotalPage(loadResponsibilitiesResult.total, pagination.records);
        }

        // Check whether user is admin.
        public bIsUserAdmin(): boolean {
            if (!this.profile)
                return false;

            return this.profile.role === UserRoles.admin;
        }

        //#endregion

        //#region Constructor

        public constructor() {
            super();

            this.loadResponsibilitiesResult = new SearchResult<Responsibility[]>();

            let pagination: Pagination = new Pagination();
            pagination.page = 1;
            pagination.records = PaginationConstant.dashboardMaxItem;
            this.loadResponsibilitiesCondition = new LoadResponsibilityViewModel();
            this.loadResponsibilitiesCondition.pagination = pagination;

            this.responsibility = new Responsibility();
        }

        //#endregion

        //#region Methods

        // Import mutation.
        @Mutation('addLoadingScreen', {namespace: 'app'})
        public addLoadingScreen: () => void;

        @Mutation('deleteLoadingScreen', {namespace: 'app'})
        public deleteLoadingScreen: () => void;


        /*
        * Called when edit responsibility is selected to be edited.
        * */
        public vOnEditResponsibilityClicked(responsibility: Responsibility) {
            this.responsibility = responsibility;
            this.bIsResponsibilityDetailModalOpened = true;
        }

        /*
        * Called when responsibility is added.
        * */
        public vOnAddResponsibilityClicked(): void {
            this.responsibility = new Responsibility();
            this.bIsResponsibilityDetailModalOpened = true;
        }

        /*
        * Called when delete responsibility button is clicked.
        * */
        public vOnDeleteResponsibilityClick(responsibility: Responsibility) {
            this.responsibility = responsibility;
            this.bIsDeleteResponsibilityModalOpened = true;
        }

        /*
        * Add responsibility using specific conditions.
        * */
        public addEditResponsibility($event: any): void {
            // Declare promise to resolve.
            let pAddEditPromise = null;
            let responsibility = $event;

            // Add loading screen.
            this.addLoadingScreen();

            // Get current context.
            if (!responsibility.id) {

                pAddEditPromise = this
                    .addResponsibilityAsync(responsibility)
                    .then(() => {
                        toastr.success('Added responsibility to system.');
                    });
            } else {
                pAddEditPromise = this
                    .editResponsibilityAsync(responsibility)
                    .then(() => {
                        toastr.success('Responsibility has been edited.');
                    });
            }

            pAddEditPromise
                .then(() => {
                    this.bIsResponsibilityDetailModalOpened = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Delete responsibility by searching for its id.
        * */
        public deleteResponsibility(id: number): void {

            // Block app UI.
            this.addLoadingScreen();

            this.deleteResponsibilityAsync(id)
                .then(() => {
                    toastr.success('Responsibility has been delete from the system successfully.');

                    // Close modal dialog.
                    this.bIsDeleteResponsibilityModalOpened = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Load responsibilities using global search condition.
        * */
        public loadResponsibilities(loadResponsibilitiesCondition: LoadResponsibilityViewModel | null): Promise<SearchResult<Responsibility[]>> {
            // Copy condition.
            let conditions: LoadResponsibilityViewModel;
            if (!loadResponsibilitiesCondition)
                conditions = Object.assign({}, this.loadResponsibilitiesCondition);
            else
                conditions = Object.assign({}, loadResponsibilitiesCondition);

            return this
                .loadResponsibilitiesAsync(conditions)
                .catch(() => {
                    let loadResponsibilitiesResult = new SearchResult<Responsibility[]>();
                    loadResponsibilitiesResult.records = [];
                    loadResponsibilitiesResult.total = 0;
                    return loadResponsibilitiesResult;
                });
        }

        /*
        * Called when responsibilities result is loaded.
        * */
        public vOnLoadResponsibilityPageChange(): void {

            // Add loading screen.
            this.addLoadingScreen();

            this.loadResponsibilities(null)
                .then((loadResponsibilitiesResult) => {
                    this.loadResponsibilitiesResult = loadResponsibilitiesResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {

            // Load responsibilities.
            this.addLoadingScreen();

            this.loadResponsibilities(null)
                .catch(() => {
                    return {
                        records: [],
                        total: 0
                    }
                })
                .then((loadResponsibilitiesResult: SearchResult<Responsibility[]>) => {
                    this.loadResponsibilitiesResult = loadResponsibilitiesResult;
                    this.deleteLoadingScreen();
                })
        }

        //#endregion
    }
</script>

<style scoped>

</style>