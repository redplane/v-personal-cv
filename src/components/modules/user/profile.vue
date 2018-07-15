<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading"><h3 class="panel-title">About me</h3></div>
                    <div class="panel-body">
                        <ul v-if="user && user.descriptions">
                            <li v-for="item in user.descriptions" class="alert alert-info"> {{item.description}}</li>
                        </ul>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading"><h3 class="panel-title">My hobbies</h3></div>
                    <div class="panel-body">
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
                                <ul v-for="skill in project.skills">
                                    <li>{{skill.name}}</li>
                                </ul>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'profile',
        dependencies: ['$userDescription', '$hobby', '$skill', '$responsibility', '$project', '$lodash', '$toastr'],
        data() {
            return {
                user: {
                    id: 1,
                    descriptions: [],
                    hobbies: [],
                    projects: [],
                    skills: []
                },
                tabIndex: 0
            }
        },
        computed: {},
        mounted() {

            // Get params in route.
            let params = this.$route.params;
            let userId = parseInt(params.id);
            let self = this;

            // List of promises that needs resolving.
            let pLoadInitialDataPromise = [];

            //#region Load user hobbies

            let loadUserHobbiesCondition = {
                userIds: [userId]
            };

            let pLoadHobbiesPromise = this.$hobby
                .loadUserHobbies(loadUserHobbiesCondition)
                .then((loadUserHobbiesResult) => {
                    self.user.hobbies = loadUserHobbiesResult.records;
                })
                .catch(() => {
                    self.user.hobbies = []
                });

            pLoadInitialDataPromise.push(pLoadHobbiesPromise);

            //#endregion

            //#region Load user descriptions

            let loadUserDescriptionsCondition = {
                userIds: [userId]
            };

            let pLoadUserDescriptionsPromise = this.$userDescription
                .loadUserDescriptions(loadUserDescriptionsCondition)
                .then((loadUserDescriptionsResult) => {
                    self.user.descriptions = loadUserDescriptionsResult.records;
                });

            pLoadInitialDataPromise.push(pLoadUserDescriptionsPromise);

            //#endregion

            //#region Load projects

            this.loadUserProjects();

            //#endregion

            Promise.all(pLoadInitialDataPromise)
                .then(() => {
                    self.$toastr.success('User data has been loaded successfully.');
                });

            this.loadUserSkillCategories();
        },
        methods: {

            /*
            * Load user skill categories by using specific conditions.
            * */
            loadUserSkillCategories() {

                if (!this.user || !this.user.id)
                    return;

                // Get class context.
                let self = this;

                // Clear skill categories list.
                let pSkillCategories = [];

                let pLoadSkillPromise = self.$skill
                    .loadSkillCategories(null, [this.user.id])
                    .then((loadSkillCategoriesResult) => {

                        //#region Load skill categories

                        let skillCategories = loadSkillCategoriesResult.records;
                        pSkillCategories = skillCategories;
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
                                pSkillCategories
                                    .map((skillCategory) => {
                                        // Extend object.
                                        skillCategory['skills'] = skillCategorySkillRelationships
                                            .filter((skillCategorySkillRelationship) => {
                                                return skillCategorySkillRelationship.skillCategoryId === skillCategory.id;
                                            })
                                            .map((skillCategorySkillRelationship) => {
                                                return {
                                                    id: skillCategorySkillRelationship.skillId,
                                                    point: skillCategorySkillRelationship.point
                                                }
                                            });

                                        return skillCategory;
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
                                pSkillCategories
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
                        self.user.skillCategories = pSkillCategories;
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
                        //#region Load project responsibility relationships

                        let projectIds = projects.map((project) => {
                            return project.id
                        });

                        return this.$project
                            .loadProjectResponsibilityRelationships(projectIds)
                            .then((loadProjectResponsibilityRelationshipsResult) => {
                                let projectResponsibilityRelationships = loadProjectResponsibilityRelationshipsResult.records;
                                pProjects = projects.map((project) => {

                                    project['responsibilities'] = projectResponsibilityRelationships
                                        .filter((projectResponsibilityRelationship) => {
                                            return projectResponsibilityRelationship.projectId === project.id;
                                        })
                                        .map((projectResponsibilityRelationship) => {
                                            return {
                                                id: projectResponsibilityRelationship.responsibilityId,
                                                projectId: projectResponsibilityRelationship.projectId,
                                                responsibilityId: projectResponsibilityRelationship.responsibilityId
                                            }
                                        });

                                    return project;
                                });

                                return projectResponsibilityRelationships;
                            });

                        //#endregion

                    })

                    .then((projectResponsibilityRelationships) => {

                        //#region Load skills

                        let responsibilityIds = projectResponsibilityRelationships.map((projectResponsibilityRelationship) => {
                            return projectResponsibilityRelationship.responsibilityId;
                        });

                        return self.$responsibility
                            .loadResponsibilities(responsibilityIds)
                            .then((loadResponsibilitiesResult) => {
                                return loadResponsibilitiesResult.records;
                            })
                            .then((responsibilities) => {
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
                                    });

                                return responsibilities;
                            });

                        //#endregion
                    })

                    .then(() => {
                        self.user.projects = pProjects;
                    });


            },

            /*
            * Called when tab is selected.
            * */
            vOnTabSelected(tabIndex){

                console.log(tabIndex);
                switch (tabIndex){
                    case 1:
                        break;

                    default:
                        this.loadUserProjects();
                }
            }
        }
    }
</script>

<style scoped>

</style>