<template>
    <div>
        <!--Skills list-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <table class="table table-condensed table-responsive">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Created time</th>
                            <th v-if="bIsUserAdmin"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="skills && skills.length"
                            v-for="skill in skills">
                            <td class="text-center">{{skill.name}}</td>
                            <td class="text-center">{{skill.createdTime}}</td>

                            <td class="text-center"
                                v-if="bIsUserAdmin">
                                <button class="btn btn-info"
                                        v-on:click="vOnEditSkillClicked(skill)">
                                    <i class="glyphicon glyphicon-pencil"></i>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-danger"
                                        v-on:click="vOnDeleteSkillClicked(skill)">
                                    <i class="glyphicon glyphicon-remove"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!skills || !skills.length">
                            <td colspan="5"
                                class="text-center">
                                <i class="text-danger">No information is available.</i>
                            </td>
                        </tr>
                        <tr v-if="bIsUserAdmin">
                            <td colspan="5">
                                <div class="pull-right">
                                    <button class="btn btn-primary"
                                            v-on:click="vOnAddSkillClicked()">
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

        <!--Skill search pagination-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <pagination v-model="loadSkillsCondition.pagination.page"
                                :total-page="totalPage"
                                align="center"
                                :boundary-links="true"
                                :direction-links="true"
                                @change="vOnLoadSkillPageChange($event)">
                    </pagination>
                </div>
            </div>
        </div>

        <!--Add/edit skill-->
        <modal :header="false"
               :footer="false"
               size="md"
               v-model="bIsSkillModalOpened"
               v-if="bIsSkillModalOpened"
               class="replace-body">
            <div slot="default">
                <skill-detail :skill-property="skill"
                              v-on:confirm="addEditSkill($event)"
                              v-on:cancel="bIsSkillModalOpened = false">
                </skill-detail>
            </div>
        </modal>

        <!--Skill delete confirmation-->
        <modal :header="false"
               size="md"
               v-model="bIsDeleteSkillModalOpened"
               v-if="bIsDeleteSkillModalOpened"
               class="replace-body">
            <div slot="default">
                <div class="text-center">
                    <i class="text-danger">Are you sure to delete <b class="text-danger">{{skill.name}}</b> from system
                        ?</i>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            @click="deleteSkill(skill)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            v-on:click="bIsDeleteSkillModalOpened = false">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">

    // Import skill detail component.
    import SkillDetail from '../skill/skill-detail.component.vue'
    import {Vue, Component} from 'vue-property-decorator'
    import {Action, Getter, Mutation} from "vuex-class"
    import {Profile} from "../../../models/profile"
    import {UserRoles} from '../../../enumerations/user-role.enum'
    import {SearchResult} from "../../../models/search-result";
    import {Skill} from "../../../models/skill";
    import {LoadSkillViewModel} from "../../../view-model/skill/load-skill.view-model";
    import {Pagination} from "../../../models/pagination";
    import {AddSkillViewModel} from "../../../view-model/skill/add-skill.view-model";
    import {EditSkillViewModel} from "../../../view-model/skill/edit-skill.view-model";
    import {PaginationConstant} from '../../../constants/pagination.constant';

    import {getTotalPage} from "../../../functions/get-total-page.function";
    import toastr from 'toastr';

    @Component({
        components:{
            SkillDetail
        }
    })
    export default class SkillManagementComponent extends Vue {

        //#region Properties

        // Profile information.
        @Getter('profile', {namespace: 'app'})
        private profile: Profile;

        // Load skills result.
        private loadSkillsResult: SearchResult<Skill[]>;

        // Load skills conditions.
        private loadSkillsCondition: LoadSkillViewModel;

        // Skill information.
        private skill: Skill;

        // Whether skill modal is opened or not.
        private bIsSkillModalOpened: boolean = false;

        // Whether delete skill modal is opened.
        private bIsDeleteSkillModalOpened: boolean = false;

        // Check whether user is admin.
        public get bIsUserAdmin(): boolean {
            if (!this.profile)
                return false;

            return this.profile.role === UserRoles.admin;
        }

        // List of skills loaded from api end-point
        public get skills(): Skill[] {
            if (!this.loadSkillsResult || !this.loadSkillsResult.records || this.loadSkillsResult.total < 1)
                return [];

            return this.loadSkillsResult.records;
        }

        /*
        * Calculate total page to display on the screen.
        * */
        public get totalPage(): number {
            // No pagination setting.
            if (!this.loadSkillsCondition)
                return 1;

            let pagination: Pagination = this.loadSkillsCondition.pagination;
            if (pagination == null || pagination.records < 1)
                return 1;

            if (!this.loadSkillsResult)
                return 1;

            let loadSkillsResult = this.loadSkillsResult;
            if (loadSkillsResult.total < 1)
                return 1;

            return getTotalPage(loadSkillsResult.total, pagination.records);
        }

        //#endregion

        //#region Constructor

        public constructor(){
            super();

            let pagination = new Pagination();
            pagination.page = 1;
            pagination.records = PaginationConstant.dashboardMaxItem;
            this.loadSkillsCondition = new LoadSkillViewModel();
            this.loadSkillsCondition.pagination = pagination;

            this.skill = new Skill();
            this.loadSkillsResult = new SearchResult<Skill[]>();
        }

        //#endregion

        //#region Methods

        // Mutation maps.
        @Mutation('addLoadingScreen', {namespace: 'app'})
        public addLoadingScreen: () => void;

        @Mutation('deleteLoadingScreen', {namespace: 'app'})
        public deleteLoadingScreen: () => void;

        @Action('addSkill', {namespace: 'apiSkill'})
        public addSkillAsync: (addSkillModel: AddSkillViewModel) => Promise<Skill>;

        @Action('editSkill', {namespace: 'apiSkill'})
        public editSkillAsync: (editSkillModel: EditSkillViewModel) => Promise<Skill>;

        @Action('deleteSkill', {namespace: 'apiSkill'})
        public deleteSkillAsync: (id: number) => Promise<void>;

        @Action('loadSkills', {namespace: 'apiSkill'})
        public loadSkillsAsync: (condition: LoadSkillViewModel) => Promise<SearchResult<Skill[]>>;

        /*
        * Called when edit skill button is clicked.
        * */
        public vOnEditSkillClicked(skill: Skill): void {
            this.skill = skill;
            this.bIsSkillModalOpened = true;
        }

        /*
        * Called when add skill button is clicked.
        * */
        public vOnAddSkillClicked(): void {
            this.skill = new Skill();
            this.bIsSkillModalOpened = true;
        }

        /*
        * Called when skill button is clicked.
        * */
        public vOnDeleteSkillClicked(skill: Skill): void {
            this.skill = skill;
            this.bIsDeleteSkillModalOpened = true;
        }

        /*
        * Called when skill is confirmed to be edited.
        * */
        public addEditSkill(skill: Skill): void {

            // Edit/add user promise.
            let pAddEditSkillPromise = null;

            // Add loading screen.
            this.addLoadingScreen();

            if (!skill.id) {
                let addSkillModel = new AddSkillViewModel();
                addSkillModel.name = skill.name;
                pAddEditSkillPromise = this
                    .addSkillAsync(addSkillModel)
                    .then(() => {
                        toastr.success('Skill has been added to system.');
                    });
            } else {

                let editSkillModel = new EditSkillViewModel();
                editSkillModel.id = skill.id;
                editSkillModel.name = skill.name;

                pAddEditSkillPromise = this
                    .editSkillAsync(editSkillModel)
                    .then(() => {
                        toastr.success('Skill has been edited.')
                    });
            }

            pAddEditSkillPromise
                .then(() => {
                    this.bIsSkillModalOpened = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })
        }

        /*
        * Delete skill from system.
        * */
        public deleteSkill(skill: Skill): void {
            if (!skill || !skill.id) {
                this.bIsDeleteSkillModalOpened = false;
                return;
            }

            // Add loading screen.
            this.addLoadingScreen();

            // Call api to delete skill.
            this.deleteSkillAsync(skill.id)
                .then(() => {
                    toastr.success('Skill has been removed !');

                    // Close modal dialog.
                    this.bIsDeleteSkillModalOpened = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Load skill using global conditions.
        * */
        public loadSkills(): Promise<SearchResult<Skill[]>> {
            let loadSkillCondition = this.loadSkillsCondition;
            return this
                .loadSkillsAsync(loadSkillCondition)
                .catch(() => {
                    let loadSkillsResult = new SearchResult<Skill[]>();
                    loadSkillsResult.records = [];
                    loadSkillsResult.total = 0;
                    return loadSkillsResult;
                });
        }

        /*
        * Called when pagination of load skill panel is clicked.
        * */
        public vOnLoadSkillPageChange(): void {
            // Block UI.
            this.addLoadingScreen();

            this.loadSkills()
                .then((loadSkillsResult: SearchResult<Skill[]>) => {
                    this.loadSkillsResult = loadSkillsResult;
                    this.deleteLoadingScreen();
                });
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {
            // Block UI.
            this.addLoadingScreen();

            this.loadSkills()
                .then((loadSkillsResult: SearchResult<Skill[]>) => {
                    this.loadSkillsResult = loadSkillsResult;
                    this.deleteLoadingScreen();
                });

        }

        //#endregion
    }
</script>

<style scoped>

</style>