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
        <div v-if="tabIndex === 1 && user && user.techniques">

            <div v-for="technique in user.techniques">
                <div class="row">
                    <div class="col-lg-3 col-xs-4">
                        <div class="thumbnail">
                            <img :src="technique.photo">
                            <div class="text-center">
                                <span>{{technique.name}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-9 col-xs-8">
                        <div class="form-group"
                             v-for="skill in technique.skills">
                            <progress-bar v-model="skill.point" label :label-text="skill.name"/>
                        </div>
                        <div class="pull-right">
                            <button class="btn btn-primary">
                                <span class="glyphicon glyphicon-plus"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'profile',
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
            }
        }
    }
</script>

<style scoped>

</style>