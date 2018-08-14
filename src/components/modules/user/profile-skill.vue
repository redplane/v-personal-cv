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
                        <progress-bar v-model="skill.point"
                                      label
                                      :label-text="skill.name"
                                      @click="vOnUserEditSkillClicked(technique, skill)"></progress-bar>
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
                        <pagination v-model="loadUserSkillCondition.pagination.page"
                                    :total-page="totalUserSkillPage"
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
            <skill-selector :skill-category-property="selectedSkillCategory"
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
                <image-cropper v-on:cancel="vOnSkillCategoryPhotoCancel()"
                               v-on:image-cropped="vOnSkillCategoryPhotoCropped"></image-cropper>
            </div>
        </modal>
    </div>
</template>

<script>
    import {mapMutations, mapGetters} from 'vuex';
    import SkillCategoryDetail from "../skill-category/skill-category-detail";
    import SkillSelector from "../../shared/skill-selector";
    import ImageCropper from '../../shared/image-cropper';
    import UserSkillDetail from './user-skill-detail';

    export default {
        name: 'user-technique-dashboard',
        components: {UserSkillDetail, SkillSelector, SkillCategoryDetail, ImageCropper},
        dependencies: ['paginationConstant', '$ui', '$user', '$toastr', '$skill'],
        props: {
            userIdProperty: null
        },
        computed: {
            techniques() {
                let self = this;
                if (!self.loadUserSkillResult)
                    return [];

                return self.loadUserSkillResult.records;
            },

            /*
            * Total page that will be displayed on screen.
            * */
            totalUserSkillPage() {
                let self = this;
                return self.$ui.loadPageCalculation(self.loadUserSkillResult.total, self.loadUserSkillCondition.pagination.records)
            },

            /*
            * Check whether profile is able to edit skill information.
            * */
            bIsAbleToEditSkill(){

                let self = this;
                if (!self.profile)
                    return false;

                let profile = self.profile();
                if (!profile)
                    return false;

                if (profile.role !== self.userRoleConstant.admin){
                    if (profile.id !== self.userId)
                        return false;

                    return true;
                }

                return true;
            }
        },
        data() {
            return {

                // Id of current user.
                userId: null,

                // Skill which is currently selected.
                oSelectedUserSkill: null,

                // Whether skill modal is available or not.
                bIsUserSkillModalAvailable: false,

                bIsAddEditSkillModalOpened: false,
                bIsAddEditTechniqueModalOpened: false,

                // Whether skill photo cropper modal is visible or not.
                bIsSkillCategoryPhotoModalVisible: false,

                // User skill search condition.
                loadUserSkillCondition: {
                    ids: null,
                    userIds: null,
                    names: null,
                    createdTime: null,
                    includeSkills: true,
                    pagination: {
                        page: 1,
                        records: this.paginationConstant.dashboardMaxItem
                    }
                },

                // User technique search result.
                loadUserSkillResult: {
                    records: [],
                    total: 0
                }
            }
        },
        mounted() {

            // Get current context.
            let self = this;

            // Add loading screen.
            self.addLoadingScreen();

            // Get user id.
            let loadUserPromise = new Promise(resolve => {
                resolve(self.userIdProperty);
            });

            loadUserPromise
                .then((userId) => {
                    self.userId = userId;
                    self.loadUserSkillCondition.userIds = [userId];

                    return self
                        ._loadUserSkills()
                })
                .then((loadUserSkillResult) => {
                    self.loadUserSkillResult = loadUserSkillResult;
                })
                .finally(() => {
                    self.deleteLoadingScreen();
                })

        },
        methods: {

            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            ...mapGetters([
                'profile'
            ]),

            /*
            * Called when technique is clicked to be edited.
            * */
            vOnEditTechniqueClicked(skillCategory) {
                let self = this;
                self.oSelectedSkillCategory = skillCategory;
                self.bIsAddEditTechniqueModalOpened = true;
            },

            /*
            * Load user skill categories by using specific conditions.
            * */
            _loadUserSkills() {
                // Get current context.
                let self = this;
                if (!self.userId || !self.userId)
                    return;

                return self.$skill
                    .loadSkillCategories(self.loadUserSkillCondition)
                    .catch(() => {
                        return {
                            records: [],
                            total: 0
                        }
                    });

            },

            /*
            * Called when pagination changed.
            * */
            vOnPaginationChange(){
                let self = this;

                // Add loading screen.
                self.addLoadingScreen();
                return self
                    ._loadUserSkills()
                    .then((loadUserSkillResult) => {
                        self.loadUserSkillResult = loadUserSkillResult;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    })
            },

            //#region Skill

            /*
            * Called when add skill button is clicked.
            * */
            vOnAddSkillClicked(skillCategory) {
                let self = this;
                self.selectedSkillCategory = skillCategory;
                self.bIsAddEditSkillModalOpened = true;
            },

            /*
            * Called when skill is selected to be edited.
            * */
            vOnUserEditSkillClicked(skillCategory, userSkill) {
                // Skill is not valid.
                if (!userSkill || !userSkill.id || !skillCategory || !skillCategory.id)
                    return;

                // Get current context.
                let self = this;

                self.oSelectedUserSkill = Object.assign({}, userSkill);
                self.oSelectedUserSkill['skillCategoryId'] = skillCategory.id;
                self.bIsUserSkillModalAvailable = true;
            },

            /*
            * Called when skill are selected to be added.
            * */
            vOnSkillsSelected(skillCategoryId, skillIds) {
                let self = this;
                // Block UI.
                self.addLoadingScreen();

                self.$skill
                    .addSkillsToCategory(skillCategoryId, skillIds)
                    .then((skillCategories) => {
                        self.$toastr.success(`${skillCategories.length} have/has been added to system successfully.`);

                        // Close modal dialog.
                        self.bIsAddEditSkillModalOpened = false;

                        // Unblock screen.
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when skill is edited.
            * */
            vOnSkillEdited(skill) {

                // Get current context.
                let self = this;

                if (!skill || !skill.id || !skill.skillCategoryId)
                    return;

                // Block screen access.
                self.addLoadingScreen();

                self.$skill
                    .editSkillCategorySkillRelationship(skill.skillCategoryId, skill.id, skill.point)
                    .then(() => {
                        // Display toast notification.
                        self.$toastr.success('Skill is edited successfully.');

                        // Hide modal dialog.
                        self.bIsUserSkillModalAvailable = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });

            },

            /*
            * Called when user skill edit modal is cancelled.
            * */
            vOnUserSkillEditCancelled() {
                let self = this;
                self.bIsUserSkillModalAvailable = false;
            },

            //#endregion

            //#region Skill category

            /*
            * Add skill category.
            * */
            addEditSkillCategory(technique) {
                let pAddEditTechniquePromise = null;
                let self = this;

                // Freeze ui.
                self.addLoadingScreen();

                if (!technique.id)
                    pAddEditTechniquePromise = self.$skill.addSkillCategory(self.userId, null, technique.description)
                        .then((skillCategory) => {
                            self.$toastr.success('A skill category has been added.');
                        });
                else
                    pAddEditTechniquePromise = self.$skill.editSkillCategory(technique.id, technique.userId, technique.photo, technique.name)
                        .then(() => {
                            self.$toastr.success('Skill has been edited successfully.');
                        });

                pAddEditTechniquePromise
                    .then(() => {
                        self.bIsAddEditTechniqueModalOpened = false;
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when add technique is clicked.
            * */
            vOnAddTechniqueClicked() {
                let self = this;
                // Clear model information.
                self.oSelectedSkillCategory = {};

                self.bIsAddEditTechniqueModalOpened = true;
            },

            /*
            * Called when skill category image cropper is clicked.
            * */
            vOnSkillCategoryImageCropperClick(skillCategory) {
                let self = this;
                self.oSelectedSkillCategory = skillCategory;
                self.bIsSkillCategoryPhotoModalVisible = true;
            },

            /*
            * Called when skill category photo image is cropped.
            * */
            vOnSkillCategoryPhotoCropped(blob) {

                // Get current context.
                let self = this;

                // Get skill category.
                let skillCategory = self.oSelectedSkillCategory;
                if (!skillCategory || !skillCategory.id)
                    return;

                if (!blob)
                    return;

                // Add loading screen.
                self.addLoadingScreen();

                // Upload image to skill category.
                self.$skill
                    .uploadSkillCategoryPhoto(skillCategory.id, blob)
                    .then(() => {
                        // Display toast notification.
                        self.$toastr.success('Skill category photo has been uploaded to server successfully.');

                        // Hide the modal.
                        self.bIsSkillCategoryPhotoModalVisible = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when skill category photo modal cancel button is clicked.
            * */
            vOnSkillCategoryPhotoCancel() {
                let self = this;
                self.bIsSkillCategoryPhotoModalVisible = false;
            }

            //#endregion

        }
    }
</script>

<style scoped>

</style>