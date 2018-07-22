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
                        <div class="panel-footer">
                            <div class="text-center">
                                <button class="btn btn-info">
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
                        <progress-bar v-model="skill.point" label :label-text="skill.name"/>
                    </div>
                    <div class="pull-right">
                        <button class="btn btn-primary"
                                v-on:click="vOnAddSkillClicked(technique)">
                            <span class="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <button class="btn btn-primary btn-block"
                        @click="vOnAddTechniqueClicked()">Add technique category
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';

    export default {
        name: 'user-technique-dashboard',
        dependencies: ['paginationConstant', '$user', '$skill'],
        props: {
            userIdProperty: null
        },
        computed: {
            techniques() {
                let self = this;
                if (!self.loadSkillResult)
                    return [];

                return self.loadSkillResult.records;
            }
        },
        data() {
            return {

                // Id of current user.
                userId: null,

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
                loadSkillResult: {
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

                    return self
                        .loadUserSkills()
                })
                .then((loadSkillResult) => {
                    self.loadSkillResult = loadSkillResult;
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

            /*
            * Called when technique is clicked to be edited.
            * */
            vOnEditTechniqueClicked(technique) {
                let self = this;
                self.selectedTechnique = technique;
                self.bIsAddEditTechniqueModalOpened = true;
            },

            /*
            * Add skill category.
            * */
            addEditTechnique(technique) {
                let pAddEditTechniquePromise = null;
                let self = this;

                // Freeze ui.
                self.addLoadingScreen();

                if (!technique.id)
                    pAddEditTechniquePromise = self.$skill.addSkillCategory(self.user.id, null, technique.description)
                        .then((skillCategory) => {
                            self.$toastr.success('A skill category has been added.');

                            // Add skill to list.
                            self.user.techniques.push(skillCategory);
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
                self.bIsAddEditTechniqueModalOpened = true;
            },

            /*
            * Load user skill categories by using specific conditions.
            * */
            loadUserSkills() {
                // Get current context.
                let self = this;
                if (!self.userId || !self.userId)
                    return;

                return self.$skill
                    .loadSkillCategories(null, null, null, null, 1, 1)
                    .catch(() => {
                        return {
                            records: [],
                            total: 0
                        }
                    });

            },

            /*
            * Called when add skill button is clicked.
            * */
            vOnAddSkillClicked(skillCategory) {
                let self = this;
                self.selectedSkillCategory = skillCategory;
                self.bIsAddEditSkillModalOpened = true;
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
            }
        }
    }
</script>

<style scoped>

</style>