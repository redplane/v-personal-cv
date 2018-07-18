<template>
    <div>
        <!--General information-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading"><h3 class="panel-title">About {{user.firstName}} {{user.lastName}}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-3">
                                <img class="img img-thumbnail img-responsive"
                                     v-bind:src="user.photo"/>
                            </div>
                            <div class="col-lg-9">
                                <ul v-if="user && user.descriptions">
                                    <li v-for="item in user.descriptions" class="alert alert-info">
                                        {{item.description}}
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)" @click="vOnAddUserDescriptionClick">Add
                                            description</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading"><h3 class="panel-title">My hobbies</h3></div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div v-if="user && user.hobbies"
                                     v-for="hobby in user.hobbies">
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <label>{{hobby.name}}</label>
                                        </div>
                                        <div class="col-lg-9">
                                            <div class="form-group">{{hobby.description}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--Tabs panel-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <tabs v-model="tabIndex"
                          @change="vOnTabSelected($event)">
                        <tab title="Project I have done"></tab>
                        <tab title="Techniques I have used"></tab>
                    </tabs>
                </div>
            </div>
        </div>

        <!--Projects-->
        <div class="row"
             v-if="tabIndex === 0 && user && user.projects">
            <div class="col-lg-12">
                <div class="form-group">
                    <table class="table table-responsive table-condensed">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Started time</th>
                            <th class="text-center">Finished time</th>
                            <th class="text-center">Responsibilities</th>
                            <th class="text-center">Skills</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="project in user.projects">
                            <td class="text-center">
                                <b class="text-success">{{project.name}}</b>
                            </td>
                            <td class="text-center">{{project.startedTime}}</td>
                            <td class="text-center">{{project.finishedTime}}</td>
                            <td>
                                <div v-for="responsibility in project.responsibilities" class="text-center">
                                    {{responsibility.name}}
                                </div>
                            </td>
                            <td class="text-center">
                                <div v-for="skill in project.skills" class="text-center">
                                    {{skill.name}}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!--Personal techniques-->
        <div v-if="tabIndex === 1 && user">
            <div v-if="user.techniques"
                 v-for="technique in user.techniques">
                <div class="row">
                    <div class="col-lg-3 col-xs-4">

                        <div class="panel panel-default">
                            <div class="panel-body text-center">
                                <img :src="technique.photo ? technique.photo : require('@/assets/skill.png')" :height="256" :width="256">
                                <div class="text-center">
                                    <span>{{technique.name}}</span>
                                </div>
                            </div>
                            <div class="panel-footer">
                                <div class="text-center">
                                    <button class="btn btn-primary"
                                            @click="vOnEditTechniqueClicked(technique)">Edit</button>
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

        <!--Add/edit user description-->
        <modal :header="false"
               :footer="false"
               v-model="bUserDescriptionModalOpened"
               v-if="bUserDescriptionModalOpened">
            <user-description-detail :user-description-property="selectedUserDescription"
                                     v-on:click-confirm="vOnUserDescriptionConfirm($event)"
                                     v-on:click-cancel="vOnUserDescriptionCancel()"/>
        </modal>

        <!--Add/edit skill modal-->
        <modal :header="false"
               :footer="false"
               v-model="bIsAddEditSkillModalOpened"
               v-if="bIsAddEditSkillModalOpened">
            <user-skill-detail :skill-category-property="selectedSkillCategory"
                               v-on:cancel="bIsAddEditSkillModalOpened = false"
                               v-on:skill-selected="vOnSkillsSelected">
            </user-skill-detail>
        </modal>

        <!--Add/edit category modal-->
        <modal :header="false"
               :footer="false"
               size="md"
               v-model="bIsAddEditTechniqueModalOpened"
               v-if="bIsAddEditTechniqueModalOpened">
            <technique-detail :skill-category-property="selectedTechnique"
                              v-on:click-ok="addEditTechnique"
                              v-on:click-cancel="bIsAddEditTechniqueModalOpened = false"></technique-detail>
        </modal>
    </div>
</template>

<script>
    import UserDescriptionDetail from "./user-description-detail";
    import UserSkillDetail from "./user-skill-detail";
    import TechniqueDetail from './technique-detail';

    export default {
        name: 'profile',
        components: {TechniqueDetail, UserSkillDetail, UserDescriptionDetail},
        dependencies: ['$user', '$userDescription', '$hobby', '$skill', '$responsibility', '$project', '$lodash', '$toastr'],
        data() {
            return {
                user: {
                    id: 1,
                    descriptions: [],
                    hobbies: [],
                    projects: [],
                    techniques: []
                },
                bUserDescriptionModalOpened: false,
                bIsAddEditSkillModalOpened: false,
                bIsAddEditTechniqueModalOpened: false,
                selectedUserDescription: null,
                selectedTechnique: null,

                selectedSkillCategory: null,
                tabIndex: 0
            }
        },
        computed: {},
        mounted() {

            // Get params in route.
            let params = this.$route.params;
            let userId = parseInt(params.id);

            // Get function context.
            let self = this;


            // List of promises that needs resolving.
            let promises = [];

            // Find user information from cache. This is for preventing requesting to api end-point too many times.
            let user = params.user;
            if (user) {
                promises[0] = new Promise((resolve) => {
                    resolve(user);
                });
            } else {
                promises[0] = self.$user
                    .loadUsers([self.user.id], null, null, null, 1, 1)
                    .then((loadUsersResult) => {
                        // Get users.
                        let users = loadUsersResult.records;
                        return users[0];
                    });
            }

            //region Load user hobbies
            promises[1] = self.loadUserHobbies();

            //Load user descriptions
            promises[2] = self.loadUserDescriptions();

            //#region Load projects
            promises[3] = self.loadUserProjects();

            //#endregion

            Promise.all(promises)
                .then((loadRecordResults) => {

                    // Get user.
                    let user = loadRecordResults[0];
                    let hobbies = loadRecordResults[1];
                    let userDescriptions = loadRecordResults[2];
                    let projects = loadRecordResults[3];

                    let pUser = {};
                    pUser.id = user.id;
                    pUser.firstName = user.firstName;
                    pUser.lastName = user.lastName;
                    pUser.photo = user.photo;

                    pUser.hobbies = hobbies;
                    pUser.descriptions = userDescriptions;
                    pUser.projects = projects;
                    pUser.techniques = [];

                    // Update user information.
                    self.user = pUser;

                    self.$toastr.success('User data has been loaded successfully.');
                });
        },
        methods: {

            /*
            * Load user skill categories by using specific conditions.
            * */
            loadUserTechniques() {

                if (!this.user || !this.user.id)
                    return;

                // Get class context.
                let self = this;

                // Clear skill categories list.
                let pTechniques = [];

                let pLoadSkillPromise = self.$skill
                    .loadSkillCategories(null, [this.user.id])
                    .then((loadSkillCategoriesResult) => {

                        //#region Load skill categories

                        let skillCategories = loadSkillCategoriesResult.records;
                        pTechniques = skillCategories;
                        return skillCategories;

                        //#endregion
                    })

                    .then((skillCategories) => {

                        //#region Load skill category - skill relationships

                        let skillCategoryIds = skillCategories.map((skillCategory) => {
                            return skillCategory.id;
                        });

                        return self.$skill
                            .loadSkillCategorySkillRelationships(skillCategoryIds)
                            .then((loadSkillCategorySkillRelationshipsResult) => {
                                let skillCategorySkillRelationships = loadSkillCategorySkillRelationshipsResult.records;
                                pTechniques
                                    .map((technique) => {
                                        // Extend object.
                                        technique['skills'] = skillCategorySkillRelationships
                                            .filter((skillCategorySkillRelationship) => {
                                                return skillCategorySkillRelationship.skillCategoryId === technique.id;
                                            })
                                            .map((skillCategorySkillRelationship) => {
                                                return {
                                                    id: skillCategorySkillRelationship.skillId,
                                                    point: skillCategorySkillRelationship.point
                                                }
                                            });

                                        return technique;
                                    });

                                return skillCategorySkillRelationships;
                            });

                        //#endregion
                    })

                    .then((skillCategorySkillRelationships) => {

                        //#region Load skills

                        let skillIds = skillCategorySkillRelationships.map((skillCategorySkillRelationship) => {
                            return skillCategorySkillRelationship.skillId
                        });

                        return self.$skill
                            .loadSkills(skillIds)
                            .then((loadSkillsResult) => {
                                return loadSkillsResult.records;
                            })
                            .then((skills) => {
                                pTechniques
                                    .map((pSkillCategory) => {
                                        // Go through every skill category - skill relationship.
                                        self.$lodash
                                            .each(pSkillCategory.skills, (skill) => {
                                                // Find the first skill matches with the skill id.
                                                let pSkill = self.$lodash.first(skills, (item) => {
                                                    return item.id === skill.id;
                                                });

                                                if (!pSkill)
                                                    return;

                                                skill['name'] = pSkill.name;
                                            });
                                    });

                                return skills;
                            });

                        //#endregion
                    });

                //#endregion

                return pLoadSkillPromise
                    .then(() => {
                        return pTechniques;
                    });
            },

            /*
            * Load user projects by using specific conditions.
            * */
            loadUserProjects() {

                // Get context.
                let self = this;

                // Projects data.
                let pProjects = [];

                return this.$project
                    .loadProjects(null, [this.user.id])

                    .then((loadProjectsResult) => {
                        let projects = loadProjectsResult.records;
                        pProjects = projects;
                        return projects;
                    })

                    .then((projects) => {

                        let projectIds = projects.map((project) => {
                            return project.id
                        });

                        // Promises to be resolved.
                        let promises = [];

                        //#region Load project responsibility relationships

                        promises[0] = self.$project
                            .loadProjectResponsibilityRelationships(projectIds)
                            .then((loadProjectResponsibilityRelationshipsResult) => {
                                return loadProjectResponsibilityRelationshipsResult.records;
                            });

                        //#endregion

                        //#region Load project skill relationships

                        promises[1] = self.$project
                            .loadProjectSkillRelationships(projectIds)
                            .then((loadProjectSkillRelationshipsResult) => {
                                return loadProjectSkillRelationshipsResult.records;
                            });

                        //#endregion

                        return Promise
                            .all(promises)
                            .then((loadRecordsResults) => {

                                let projectResponsibilityRelationships = loadRecordsResults[0];
                                let projectSkillRelationships = loadRecordsResults[1];
                                pProjects = projects.map((project) => {

                                    project['responsibilities'] = projectResponsibilityRelationships
                                        .filter((projectResponsibilityRelationship) => {
                                            return projectResponsibilityRelationship.projectId === project.id;
                                        })
                                        .map((projectResponsibilityRelationship) => {
                                            return {
                                                id: projectResponsibilityRelationship.responsibilityId
                                            }
                                        });

                                    project['skills'] = projectSkillRelationships
                                        .filter((projectSkillRelationship) => {
                                            return projectSkillRelationship.projectId === project.id;
                                        })
                                        .map((projectSkillRelationship) => {
                                            return {
                                                id: projectSkillRelationship.skillId
                                            }
                                        });

                                    return project;
                                });
                            });
                    })

                    .then((projectResponsibilityRelationships) => {

                        // Promises to be resolved.
                        let promises = [];

                        let responsibilityIds = [];
                        let skillIds = [];

                        //#region Load responsibilities

                        // Go through every project.
                        self.$lodash
                            .each(pProjects, (project) => {

                                responsibilityIds = project.responsibilities
                                    .map((responsibility) => {
                                        return responsibility.id;
                                    });

                                skillIds = project.skills
                                    .map((skill) => {
                                        return skill.id;
                                    });
                            });

                        promises[0] = self.$responsibility
                            .loadResponsibilities(responsibilityIds)
                            .then((loadResponsibilitiesResult) => {
                                return loadResponsibilitiesResult.records;
                            });

                        //#endregion

                        //#region Load skills

                        promises[1] = self.$skill
                            .loadSkills(skillIds)
                            .then((loadSkillsResult) => {
                                return loadSkillsResult.records;
                            });

                        //#endregion

                        return Promise.all(promises)
                            .then((loadRecordResults) => {
                                let responsibilities = loadRecordResults[0];
                                let skills = loadRecordResults[1];

                                pProjects
                                    .map((project) => {

                                        // Go through every skill category - skill relationship.
                                        self.$lodash
                                            .each(project.responsibilities, (responsibility) => {
                                                // Find the first skill matches with the skill id.
                                                let pResponsibility = self.$lodash.first(responsibilities, (item) => {
                                                    return item.id === responsibility.id;
                                                });

                                                if (!pResponsibility)
                                                    return;


                                                responsibility['name'] = pResponsibility.name;
                                            });

                                        self.$lodash
                                            .each(project.skills, (skill) => {
                                                // Find the first skill matches with the skill id.
                                                let pSkill = self.$lodash.first(skills, (item) => {
                                                    return item.id === responsibility.id;
                                                });

                                                if (!pSkill)
                                                    return;


                                                skill['name'] = pSkill.name;
                                            });
                                    });

                                return pProjects;
                            });

                        //#endregion
                    })

                    .then(() => {
                        return pProjects;
                    });


            },

            /*
            * Load user hobbies by using specific conditions.
            * */
            loadUserHobbies() {
                // Get current function context.
                let self = this;

                // Get user id.
                return self.$hobby
                    .loadUserHobbies(null, [self.user.id], null)
                    .then((loadUserHobbiesResult) => {
                        return loadUserHobbiesResult.records;
                    })
                    .catch(() => {
                        self.user.hobbies = []
                    });
            },

            /*
            * Load user descriptions by using specific conditions.
            * */
            loadUserDescriptions() {
                // Get function context.
                let self = this;

                return self.$userDescription
                    .loadUserDescriptions(null, [self.user.id], null, null)
                    .then((loadUserDescriptionsResult) => {
                        return loadUserDescriptionsResult.records;
                    })
                    .catch(() => {
                        return [];
                    });
            },

            /*
            * Called when tab is selected.
            * */
            vOnTabSelected(tabIndex) {

                // Get function context.
                let self = this;

                switch (tabIndex) {
                    case 1:
                        // Clear user techniques.
                        self.user.techniques = [];

                        this.loadUserTechniques()
                            .then((techniques) => {
                                self.user['techniques'] = techniques;
                            });
                        break;

                    default:

                        // Clear user projects.
                        self.user.projects = [];

                        this.loadUserProjects()
                            .then((projects) => {
                                self.user['projects'] = projects;
                            });
                }
            },

            /*
            * Called when add user description is clicked.
            * */
            vOnAddUserDescriptionClick() {
                this.selectedUserDescription = {
                    userId: this.user.id,
                    description: ''
                };

                this.bUserDescriptionModalOpened = true;
            },

            /*
            * Called when add/edit user description is confirmed adding/editing.
            * */
            vOnUserDescriptionConfirm(model) {
                let self = this;
                self.$userDescription
                    .addUserDescription(model.userId, model.description)
                    .then((userDescription) => {
                        self.bUserDescriptionModalOpened = false;

                        // Add description to list.
                        self.user.descriptions.push(userDescription);

                        self.$toastr.success('Added user description successfully.');
                    });
            },

            /*
            * Called when add/edit user description is cancelled.
            * */
            vOnUserDescriptionCancel() {
                this.bUserDescriptionModalOpened = false;
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
                self.$skill
                    .addSkillsToCategory(skillCategoryId, skillIds)
                    .then((skillCategories) => {
                        self.$toastr.success(`${skillCategories.length} have/has been added to system successfully.`);

                        // Close modal dialog.
                        self.bIsAddEditSkillModalOpened = false;
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
            * Called when technique is clicked to be edited.
            * */
            vOnEditTechniqueClicked(technique){
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

                if (!technique.id)
                    pAddEditTechniquePromise = self.$skill.addSkillCategory(self.user.id, null, technique.description)
                        .then((skillCategory) => {
                            self.$toastr.success('A skill category has been added.');

                            // Add skill to list.
                            self.user.techniques.push(skillCategory);
                        });
                else
                    pAddEditTechniquePromise = self.$skill.editSkillCategory(technique.id,technique.userId, technique.photo, technique.name)
                        .then(() => {
                            self.$toastr.success('Skill has been edited successfully.');
                        });

                pAddEditTechniquePromise
                    .then(() => {
                        self.bIsAddEditTechniqueModalOpened = false;
                    });
            }
        }
    }
</script>

<style scoped>

</style>