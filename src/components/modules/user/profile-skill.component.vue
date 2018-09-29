<template>
    <div>
        <div v-if="techniques"
             v-for="technique in techniques">
            <div class="row">
                <div class="col-lg-3 col-xs-4">

                    <div class="panel panel-default">
                        <div class="panel-body text-center">
                            <img :src="technique.photo ? technique.photo : require('@/assets/skill.png')" :height="256"
                                 :width="256">
                            <div class="text-center">
                                <span>{{technique.name}}</span>
                            </div>
                        </div>
                        <div class="panel-footer" v-if="bIsAbleToEditSkill">
                            <div class="text-center">
                                <button class="btn btn-info"
                                        @click="vOnSkillCategoryImageCropperClick(technique)">
                                    <span class="fa fa-camera"></span>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-primary"
                                        @click="vOnEditTechniqueClicked(technique)">
                                    <span class="fa fa-edit"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9 col-xs-8">
                    <div class="form-group"
                         v-for="skill in technique.skills">
                        <div :class="{'input-group': profile}"
                             v-if="((editingSkill.skillId !== skill.skillId) || (editingSkill.skillCategoryId !== skill.skillCategoryId))">

                            <!--Skill is not being edited-->
                            <div class="form-control">
                                <progress-bar v-model="skill.point"
                                              label
                                              :label-text="skill.name"
                                              @click="vOnUserEditSkillClicked(skill)"></progress-bar>
                            </div>

                            <span class="input-group-btn" v-if="profile">
                                <button class="btn btn-info"
                                        @click="vOnSkillSelectedToEdited(skill)">
                                    <span class="fa fa-edit"></span>
                                </button>
                                <button class="btn btn-danger"
                                        @click="vOnSkillClickDelete(technique.id, skill.skillId)">
                                    <span class="fa fa-trash"></span>
                                </button>
                            </span>
                        </div>

                        <!--Skill is being edited-->
                        <div v-else-if="profile"
                             class="input-group">
                            <input class="form-control"
                                   type="number"
                                   min="1"
                                   max="100"
                                   step="1"
                                   v-model="editingSkill.point">

                            <span class="input-group-btn">
                                <button class="btn btn-primary"
                                        @click="vOnEditSkillInfo()">
                                    <span class="fa fa-check"></span>
                                </button>

                                <button class="btn btn-danger"
                                        @click="vOnCancelSkillEdit()">
                                    <span class="fa fa-times"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    <div class="pull-right"
                         v-if="bIsAbleToEditSkill">
                        <button class="btn btn-primary"
                                v-on:click="vOnAddSkillClicked(technique)">
                            <span class="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
        </div>

        <!--Pagination-->
        <div class="row">
            <div class="form-group">
                <div class="text-center">
                    <div class="form-group">
                        <pagination v-model="loadSkillCategoryCondition.pagination.page"
                                    :total-page="totalSkillCategoryPage"
                                    :boundary-links="true"
                                    size="sm"
                                    @change="vOnPaginationChange()">
                        </pagination>
                    </div>
                </div>
            </div>
        </div>

        <!--Toolbar button-->
        <button class="scroll-to-top btn btn-primary"
                v-if="bIsAbleToEditSkill"
                @click="vOnAddTechniqueClicked()">
            <span class="fa fa-folder"></span>
        </button>

        <!--Add/edit skill modal-->
        <modal :header="false"
               :footer="false"
               v-model="bIsAddEditSkillModalOpened"
               v-if="bIsAddEditSkillModalOpened"
               class="replace-body">
            <skill-selector :skill-category-property="oSelectedSkillCategory"
                            v-on:cancel="bIsAddEditSkillModalOpened = false"
                            v-on:select-skill="vOnSkillsSelected">
            </skill-selector>
        </modal>

        <!--User skill detail modal-->
        <modal :header="false"
               :footer="false"
               v-model="bIsUserSkillModalAvailable"
               v-if="bIsUserSkillModalAvailable"
               class="replace-body">
            <user-skill-detail :skill-property="oSelectedUserSkill"
                               v-on:confirm="vOnSkillEdited"
                               v-on:cancel="vOnUserSkillEditCancelled"></user-skill-detail>
        </modal>

        <!--Add/edit skill category modal-->
        <modal :header="false"
               :footer="false"
               size="md"
               v-model="bIsAddEditTechniqueModalOpened"
               v-if="bIsAddEditTechniqueModalOpened"
               class="replace-body">
            <skill-category-detail :skill-category-property="oSelectedSkillCategory"
                                   v-on:click-ok="addEditSkillCategory"
                                   v-on:click-cancel="bIsAddEditTechniqueModalOpened = false">
            </skill-category-detail>
        </modal>

        <!--User profile selector-->
        <modal :header="false"
               :footer="false"
               v-model="bIsSkillCategoryPhotoModalVisible"
               v-if="bIsSkillCategoryPhotoModalVisible"
               class="replace-body">
            <div slot="default">
                <image-cropper @cancel="vOnSkillCategoryPhotoCancel()"
                               @image-cropped="vOnSkillCategoryPhotoCropped"></image-cropper>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">
    import SkillCategoryDetail from "../skill-category/skill-category-detail.component.vue";
    import ImageCropper from '../../shared/image-cropper/image-cropper.component.vue';
    import UserSkillDetailComponent from './user-skill-detail.component.vue';
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Profile} from "../../../models/profile";
    import {Action, Getter, Mutation} from "vuex-class";
    import {UserRoles} from "../../../enumerations/user-role.enum";
    import {LoadSkillCategoryViewModel} from "../../../view-model/skill-category/load-skill-category.view-model";
    import {SkillCategory} from "../../../models/skill-category";
    import {SearchResult} from "../../../models/search-result";
    import {Skill} from "../../../models/skill";
    import {HasSkillViewModel} from "../../../view-model/has-skill.view-model";
    import {SkillCategoryViewModel} from "../../../view-model/skill-category.view-model";
    import {EditSkillCategoryViewModel} from "../../../view-model/skill-category/edit-skill-category.view-model";
    import {AddSkillsToCategoryViewModel} from "../../../view-model/skill-category/add-skills-to-category.view-model";
    import {EditSkillCategorySkillRelationshipViewModel} from "../../../view-model/skill-category-skill-relationship/edit-skill-category-skill-relationship.view-model";
    import {DeleteCategorySkillRelationshipViewModel} from "../../../view-model/skill-category-skill-relationship/delete-category-skill-relationship.view-model";
    import {AddSkillCategoryViewModel} from "../../../view-model/skill-category/add-skill-category.view-model";
    import SkillSelectorComponent from '@/components/shared/skill-selector/skill-selector.component.vue';

    import toastr from 'toastr';

    @Component({
        components: {
            UserSkillDetailComponent, SkillSelectorComponent, SkillCategoryDetail, ImageCropper
        }
    })
    export default class ProfileSkillComponent extends Vue {

        //#region Properties

        // Profile information.
        @Getter('profile', {namespace: 'app'})
        public profile: Profile;

        // User id property.
        @Prop(Number)
        private userIdProperty: number;

        // Id of user which is being viewed.
        private userId: number;

        // Id of skill which is currently being edited.
        private editingSkill: HasSkillViewModel = new HasSkillViewModel();

        // Skill which is currently selected.
        private oSelectedUserSkill: any;

        // Skill category which is selected.
        private oSelectedSkillCategory: SkillCategory;

        // Condition to load skill categories.
        private loadSkillCategoryCondition: LoadSkillCategoryViewModel;

        // Category load result.
        private loadSkillCategoryResult: SearchResult<SkillCategoryViewModel[]>;

        // Whether skill modal is available or not.
        private bIsUserSkillModalAvailable: boolean = false;

        // Whether add/edit skill modal is available or not.
        private bIsAddEditSkillModalOpened: boolean = false;

        // Whether add/edit skill category modal is available or not.
        private bIsAddEditTechniqueModalOpened: boolean = false;

        // Whether skill photo cropper modal is visible or not.
        private bIsSkillCategoryPhotoModalVisible: boolean = false;

        /*
        * Check whether profile is able to edit skill information.
        * */
        public get bIsAbleToEditSkill(): boolean {
            if (!this.profile)
                return false;

            if (this.profile.role !== UserRoles.admin) {
                if (this.profile.id !== this.userId)
                    return false;

                return true;
            }

            return true;
        }

        /*
        * List of skill categories to be displayed.
        * */
        public get techniques(): Array<SkillCategoryViewModel> {

            if (!this.loadSkillCategoryResult)
                return new Array<SkillCategoryViewModel>();

            let skillCategories = this.loadSkillCategoryResult.records;
            if (!skillCategories)
                return new Array<SkillCategoryViewModel>();

            return skillCategories;
        }

        /*
        * Total page that will be displayed on screen.
        * */
        public get totalSkillCategoryPage(): number {

            // Invalid search result.
            if (!this.loadSkillCategoryResult || !this.loadSkillCategoryResult.total)
                return 1;

            if (!this.loadSkillCategoryCondition || !this.loadSkillCategoryCondition.pagination || !this.loadSkillCategoryCondition.pagination.records)
                return 1;

            return this.loadSkillCategoryResult.totalPage(this.loadSkillCategoryCondition.pagination.records);
        }

        //#endregion

        //#region Constructor

        /*
        * Initialize component with settings.
        * */
        public constructor() {
            super();
            this.loadSkillCategoryCondition = new LoadSkillCategoryViewModel();
            this.loadSkillCategoryResult = new SearchResult<SkillCategoryViewModel[]>();
        }

        //#endregion

        //#region Methods

        // Map mutations.
        @Mutation('addLoadingScreen', {namespace: 'app'})
        public addLoadingScreen: () => void;

        // Delete loading screen.
        @Mutation('deleteLoadingScreen', {namespace: 'app'})
        public deleteLoadingScreen: () => void;

        @Action('loadSkillCategories')
        public loadSkillCategoriesAsync: (conditions: LoadSkillCategoryViewModel) => Promise<SearchResult<SkillCategoryViewModel[]>>;

        @Action('addSkillsToCategory')
        public addSkillsToCategoryAsync: (model: AddSkillsToCategoryViewModel) => Promise<SkillCategoryViewModel[]>;

        @Action('editSkillCategorySkillRelationship')
        public editSkillCategorySkillRelationshipAsync: (model: EditSkillCategorySkillRelationshipViewModel) => Promise<void>;

        @Action('deleteSkillCategorySkillRelationship')
        public deleteSkillCategorySkillRelationshipAsync: (model: DeleteCategorySkillRelationshipViewModel) => Promise<void>;

        @Action('addSkillCategory')
        public addSkillCategoryAsync: (model: AddSkillCategoryViewModel) => Promise<SkillCategory>;

        @Action('editSkillCategory')
        public editSkillCategoryAsync: (model: EditSkillCategoryViewModel) => Promise<SkillCategory>;

        /*
        * Called when technique is clicked to be edited.
        * */
        public vOnEditTechniqueClicked(skillCategory: SkillCategory) {
            this.oSelectedSkillCategory = skillCategory;
            this.bIsAddEditTechniqueModalOpened = true;
        }

        /*
        * Load user skill categories by using specific conditions.
        * */
        private loadSkillCategories(): Promise<SearchResult<SkillCategoryViewModel[]>> {

            // Initialize search result.
            let loadHasSkillResult = new SearchResult<SkillCategoryViewModel[]>();
            loadHasSkillResult.records = [];
            loadHasSkillResult.total = 0;

            // User id isn't defined.
            if (!this.userId || !this.userId)
                return new Promise(resolve => resolve(loadHasSkillResult));

            return this
                .loadSkillCategoriesAsync(this.loadSkillCategoryCondition)
                .catch(() => {
                    return new SearchResult<SkillCategoryViewModel[]>();
                });

        }

        /*
        * Called when pagination changed.
        * */
        public vOnPaginationChange(): void {

            // Add loading screen.
            this.addLoadingScreen();

            this
                .loadSkillCategories()
                .then((loadSkillCategoryResult: SearchResult<SkillCategoryViewModel[]>) => {
                    this.loadSkillCategoryResult = loadSkillCategoryResult;
                    this.deleteLoadingScreen();
                })
                .catch(() => {
                    this.deleteLoadingScreen();
                });
        }

        //#region Skill

        /*
        * Called when add skill button is clicked.
        * */
        public vOnAddSkillClicked(skillCategory: SkillCategory): void {
            this.oSelectedSkillCategory = skillCategory;
            this.bIsAddEditSkillModalOpened = true;
        }

        /*
        * Called when skill is selected to be edited.
        * */
        public vOnUserEditSkillClicked(skillCategory: SkillCategory, userSkill: Skill): void {
            // Skill is not valid.
            if (!userSkill || !userSkill.id || !skillCategory || !skillCategory.id)
                return;

            this.oSelectedUserSkill = Object.assign({}, userSkill);
            this.oSelectedUserSkill['skillCategoryId'] = skillCategory.id;
            this.bIsUserSkillModalAvailable = true;
        }

        /*
        * Called when skill are selected to be added.
        * */
        public vOnSkillsSelected(skillCategoryId: number, hasSkills: Array<HasSkillViewModel> | null): void {
            // Block UI.
            this.addLoadingScreen();

            let model = new AddSkillsToCategoryViewModel();
            model.skillCategoryId = skillCategoryId;
            model.hasSkills = hasSkills;

            this.addSkillsToCategoryAsync(model)
                .then((skillCategories: SkillCategoryViewModel[]) => {
                    toastr.success(`${skillCategories.length} have/has been added to system successfully.`);
                    // Close modal dialog.
                    this.bIsAddEditSkillModalOpened = false;

                    return this.loadSkillCategories();
                })
                .then((loadSkillCategoryResult: SearchResult<SkillCategoryViewModel[]>) => {
                    this.loadSkillCategoryResult = loadSkillCategoryResult;
                })
                .finally(() => {
                    // Unblock screen.
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when skill is edited.
        * */
        public vOnSkillEdited(skill) {
            if (!skill || !skill.id || !skill.skillCategoryId)
                return;

            // Block screen access.
            this.addLoadingScreen();

            let model = new EditSkillCategorySkillRelationshipViewModel();
            model.skillCategoryId = skill.skillCategoryId;
            model.skillId = skill.id;
            model.point = skill.point;

            this.editSkillCategorySkillRelationshipAsync(model)
                .then(() => {
                    // Display toast notification.
                    toastr.success('Skill is edited successfully.');

                    // Hide modal dialog.
                    this.bIsUserSkillModalAvailable = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });

        }

        /*
        * Called when user skill edit modal is cancelled.
        * */
        public vOnUserSkillEditCancelled(): void {
            this.bIsUserSkillModalAvailable = false;
        }

        /*
        * Called when skill delete button is clicked.
        * */
        public vOnSkillClickDelete(skillCategoryId: number, skillId: number): void {
            let deleteSkillCategorySkillCondition = {
                skillCategoryId: skillCategoryId,
                skillId: skillId
            };

            // Block the screen access.
            this.addLoadingScreen();

            this.deleteSkillCategorySkillRelationshipAsync(deleteSkillCategorySkillCondition)
                .then(() => {
                    return this.loadSkillCategories();
                })
                .then((loadSkillCategoryResult: SearchResult<SkillCategoryViewModel[]>) => {
                    this.loadSkillCategoryResult = loadSkillCategoryResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })
        }

        //#endregion

        //#region Skill category

        /*
        * Add skill category.
        * */
        public addEditSkillCategory(technique: SkillCategoryViewModel): void {
            let pAddEditTechniquePromise = null;

            // Freeze ui.
            this.addLoadingScreen();

            if (!technique.id) {

                let addSkillCategoryModel = new AddSkillCategoryViewModel();
                addSkillCategoryModel.userId = this.userId;
                addSkillCategoryModel.name = technique.name;
                addSkillCategoryModel.photo = technique.photo;

                pAddEditTechniquePromise = this.addSkillCategoryAsync(addSkillCategoryModel)
                    .then((skillCategory: SkillCategory) => {
                        toastr.success('A skill category has been added.');
                    });
            }
            else {

                let editSkillCategoryModel = new EditSkillCategoryViewModel();
                editSkillCategoryModel.id = technique.id;
                editSkillCategoryModel.name = technique.name;

                pAddEditTechniquePromise = this
                    .editSkillCategoryAsync(technique)
                    .then((editSkillCategoryResult: SkillCategory) => {
                        toastr.success('Skill category has been edited successfully.');
                        for (let skillCategory of this.loadSkillCategoryResult.records) {
                            if (skillCategory.id !== editSkillCategoryResult.id)
                                continue;

                            skillCategory.name = editSkillCategoryResult.name;
                            skillCategory.photo = editSkillCategoryResult.photo;
                        }
                    });
            }

            pAddEditTechniquePromise
                .then(() => {
                    this.bIsAddEditTechniqueModalOpened = false;
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when add technique is clicked.
        * */
        public vOnAddTechniqueClicked(): void {
            // Clear model information.
            this.oSelectedSkillCategory = new SkillCategory();
            this.bIsAddEditTechniqueModalOpened = true;
        }

        /*
        * Called when skill category image cropper is clicked.
        * */
        public vOnSkillCategoryImageCropperClick(skillCategory: SkillCategory): void {
            let self = this;
            self.oSelectedSkillCategory = skillCategory;
            self.bIsSkillCategoryPhotoModalVisible = true;
        }

        /*
        * Called when skill category photo image is cropped.
        * */
        public vOnSkillCategoryPhotoCropped(blob: Blob): void {

            // Get skill category.
            let skillCategory = this.oSelectedSkillCategory;
            if (!skillCategory || !skillCategory.id)
                return;

            if (!blob)
                return;

            // Initialize model.
            let model: EditSkillCategoryViewModel = new EditSkillCategoryViewModel();
            model.id = skillCategory.id;
            model.photo = blob;

            // Add loading screen.
            this.addLoadingScreen();

            // Upload image to skill category.
            this.editSkillCategoryAsync(model)
                .then((editSkillCategoryResult: SkillCategory) => {
                    // Display toast notification.
                    toastr.success('Skill category photo has been uploaded to server successfully.');

                    for (let skillCategory of this.loadSkillCategoryResult.records) {
                        if (skillCategory.id !== editSkillCategoryResult.id)
                            continue;

                        skillCategory.name = editSkillCategoryResult.name;
                        skillCategory.photo = editSkillCategoryResult.photo;
                    }

                    // Hide the modal.
                    this.bIsSkillCategoryPhotoModalVisible = false;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when skill category photo modal cancel button is clicked.
        * */
        public vOnSkillCategoryPhotoCancel(): void {
            this.bIsSkillCategoryPhotoModalVisible = false;
        }

        /*
        * Called when skill is selected to be editted.
        * */
        public vOnSkillSelectedToEdited(skillInfo: HasSkillViewModel): void {
            this.editingSkill = new HasSkillViewModel();
            this.editingSkill = Object.assign({}, skillInfo);
        }

        /*
        * Called when skill is cancelled editing.
        * */
        public vOnCancelSkillEdit(): void {
            this.editingSkill = new HasSkillViewModel();
        }

        /*
        * Called when skill info is confirmed to be edited.
        * */
        public vOnEditSkillInfo(): void {

            // Get skill info.
            let skillInfo: HasSkillViewModel = this.editingSkill;
            if (!skillInfo)
                return;

            // Add loading screen.
            this.addLoadingScreen();

            let model = new EditSkillCategorySkillRelationshipViewModel();
            model.skillCategoryId = skillInfo.skillCategoryId;
            model.skillId = skillInfo.skillId;
            model.point = skillInfo.point;

            this.editSkillCategorySkillRelationshipAsync(model)
                .then(() => {
                    return this.loadSkillCategories()
                })
                .then((loadSkillResult: SearchResult<SkillCategoryViewModel[]>) => {
                    // Cancel skill editing.
                    this.editingSkill = new HasSkillViewModel();
                    this.loadSkillCategoryResult = loadSkillResult;

                    toastr.success('Skill point has been edited');
                    return loadSkillResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {
            // Add loading screen.
            this.addLoadingScreen();

            // Get user id.
            let loadUserPromise = new Promise(resolve => {
                resolve(this.userIdProperty);
            });

            loadUserPromise
                .then((userId: number) => {
                    this.userId = userId;
                    this.loadSkillCategoryCondition.userIds = [userId];
                    this.loadSkillCategoryCondition.includeSkills = true;

                    return this
                        .loadSkillCategories()
                })
                .then((loadSkillCategoryResult: SearchResult<SkillCategoryViewModel[]>) => {
                    this.loadSkillCategoryResult = loadSkillCategoryResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                })

        }

        //#endregion
    }
</script>

<style scoped>

</style>