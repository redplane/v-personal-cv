<template>
    <div>
        <div class="panel panel-info"
             v-if="project">
            <div class="panel-heading">
                <h3 class="panel-title">{{ ( project.id ? 'Edit project' : 'Add project')}}</h3>
            </div>
            <div class="panel-body">
                <!--Project name-->
                <div class="row">
                    <div class="col-lg-12">
                        <label>Name</label>
                        <div class="form-group">
                            <input class="form-control"
                                   v-model="project.name"/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <date-picker v-model="project.startedTime"
                                         format="yyyy/MM/dd"
                                         :today-btn="false"
                                         :clear-btn="false"></date-picker>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <date-picker v-model="project.finishedTime" format="yyyy/MM/dd" :today-btn="false"
                                         :clear-btn="false"></date-picker>
                        </div>
                    </div>
                </div>

                <!--Description-->
                <div class="row">
                    <div class="col-lg-12">
                        <label>Description</label>
                        <div class="form-group">
                            <textarea class="form-control"
                                      v-model="project.description"
                                      rows="5"></textarea>
                        </div>
                    </div>
                </div>

                <!--Responsibilities & roles tabs-->
                <div class="row">
                    <div class="col-lg-12">
                        <tabs>
                            <tab title="Skills">
                                <div class="form-group">
                                    <table class="table table-striped table-condensed">
                                        <thead>
                                        <tr>
                                            <th class="text-center">Name</th>
                                            <th class="text-center"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-if="!addedSkills || addedSkills.length < 1">
                                            <td colspan="2"
                                                class="text-center">
                                                <i class="text-danger">There is no skills assigned to this project</i>
                                            </td>
                                        </tr>
                                        <tr v-else
                                            v-for="addedSkill in addedSkills">
                                            <td class="text-center">
                                                {{addedSkill.name}}
                                            </td>
                                            <td class="text-center">
                                                <button class="btn btn-danger"
                                                        @click="deleteLocalSkill(addedSkill)">
                                                    <span class="fa fa-trash"></span>
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="form-group">
                                    <div class="input-group">
                                        <input id="input-skill" class="form-control" type="text"
                                               placeholder="Type to search...">
                                        <span class="input-group-btn">
                                                <button class="btn btn-primary"
                                                        :disabled="!bIsAbleToAddSkill"
                                                        @click="addLocalSkill(addSkillModel)">
                                                <span class="fa fa-check"></span>
                                            </button>
                                        </span>
                                    </div>
                                </div>

                                <typeahead v-model="addSkillModel" target="#input-skill" force-select
                                           :async-function="vOnSkillQueried"
                                           item-key="name"></typeahead>
                            </tab>

                            <tab title="Responsibilities">
                                <div class="form-group">
                                    <table class="table table-striped table-condensed">
                                        <thead>
                                        <tr>
                                            <th class="text-center">Name</th>
                                            <th class="text-center"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-if="!addedResponsibilities">
                                            <td colspan="2" class="text-center">
                                                <i class="text-danger">No responsibility has been assigned to this
                                                    project.</i>
                                            </td>
                                        </tr>
                                        <tr v-else
                                            v-for="addedResponsibility in addedResponsibilities">
                                            <td class="text-center">
                                                {{addedResponsibility.name}}
                                            </td>
                                            <td class="text-center">
                                                <button class="btn btn-danger"
                                                        @click="deleteLocalResponsibility(addedResponsibility)">
                                                    <span class="fa fa-trash"></span>
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="form-group">
                                    <div class="input-group">
                                        <input id="input-responsibility" class="form-control" type="text"
                                               placeholder="Type to search...">
                                        <span class="input-group-btn">
                                            <button class="btn btn-primary"
                                                    :disabled="!bIsAbleToAddResponsibility"
                                                    @click="addLocalResponsibility(addResponsibilityModel)">
                                                <span class="fa fa-check"></span>
                                            </button>
                                        </span>
                                    </div>

                                    <typeahead v-model="addResponsibilityModel"
                                               target="#input-responsibility"
                                               force-select
                                               :async-function="vOnResponsibilityQueried"
                                               item-key="name"></typeahead>
                                </div>
                            </tab>
                        </tabs>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <div class="text-center">
                    <button class="btn btn-primary"
                            @click="vOnClickOk()">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'add-profile-project',
        dependencies: ['paginationConstant', '$skill', '$responsibility', '$promiseManager'],
        props: {
            projectProperty: {}
        },
        computed: {
            /*
            * Whether user can add skill or not.
            * */
            bIsAbleToAddSkill() {
                if (!this.addSkillModel)
                    return false;

                if (!this.addSkillModel.id)
                    return false;

                return true;
            },

            /*
            * Whether user can add responsibility or not.
            * */
            bIsAbleToAddResponsibility() {
                if (!this.addResponsibilityModel)
                    return false;

                if (!this.addResponsibilityModel.id)
                    return false;

                return true;
            }

        },
        data() {
            return {
                /*
                * Project information.
                * */
                project: null,

                // List of added responsibilities
                addedResponsibilities: [],

                // List of added skills.
                addedSkills: [],

                /*
                * Information of skill that will be added into project.
                * */
                addSkillModel: null,

                /*
                * Information of responsibility will be added into project.
                * */
                addResponsibilityModel: null,

                // Promise that used for loading skills.
                _loadSkillPromise: null,

                // Promise that used for loading responsibilities.
                _loadResponsibilityPromise: null
            }
        },
        methods: {
            /*
            * Called when user is querying a skill.
            * */
            vOnSkillQueried(query, done) {
                let self = this;

                let loadSkillsCondition = {
                    names: query ? [query] : null,
                    pagination: {
                        page: 1,
                        records: self.paginationConstant.typeaheadMaxItem
                    }
                };

                // Cancel the previous promise.
                if (self._loadSkillPromise) {
                    self.$promiseManager
                        .cancelPromise(self._loadSkillPromise);
                }

                let pLoadSkillPromise = self.$skill
                    .loadSkills(loadSkillsCondition);

                self._loadSkillPromise = self.$promiseManager
                    .addCancellablePromise(pLoadSkillPromise);

                self._loadSkillPromise
                    .then((loadSkillsResult) => {
                        done(loadSkillsResult.records);
                    })
                    .catch(() => {
                        done([]);
                    });
            },

            /*
            * Called when user is querying a responsibility
            * */
            vOnResponsibilityQueried(query, done) {
                let self = this;

                let loadResponsibilitiesCondition = {
                    names: query ? [query] : null,
                    pagination: {
                        page: 1,
                        records: self.paginationConstant.typeaheadMaxItem
                    }
                };

                // Cancel the previous promise.
                if (self._loadResponsibilityPromise) {
                    self.$promiseManager
                        .cancelPromise(self._loadResponsibilityPromise);
                }

                let pLoadResponsibilityPromise = self.$responsibility
                    .loadResponsibilities(loadResponsibilitiesCondition);

                self._loadResponsibilityPromise = self.$promiseManager
                    .addCancellablePromise(pLoadResponsibilityPromise);

                self._loadResponsibilityPromise
                    .then((loadResponsibilityResult) => {
                        done(loadResponsibilityResult.records);
                    })
                    .catch(() => {
                        done([]);
                    });
            },

            /*
            * Add skill to local list.
            * */
            addLocalSkill(skill) {
                // Skill is invalid.
                if (!skill)
                    return;

                // Get current context.
                let self = this;

                // Find added item.
                let items = self.addedSkills
                    .filter((addedSkill) => addedSkill.id === skill.id);

                if (items && items.length)
                    return;

                self.addedSkills.push(skill);

                // Clear addSkillModel.
                self.addSkillModel = null;
            },

            /*
            * Delete skill from list locally.
            * */
            deleteLocalSkill(skill) {
                // Skill is invalid.
                if (!skill)
                    return;

                // Get current context.
                let self = this;
                let iItemIndex = self.addedSkills.indexOf(skill);
                if (iItemIndex < 0)
                    return;

                self.addedSkills
                    .splice(iItemIndex, 1);
            },

            /*
            * Add responsibility to local list.
            * */
            addLocalResponsibility(responsibility) {
                // Responsibility is invalid.
                if (!responsibility)
                    return;

                // Get current context.
                let self = this;

                // Find the added item.
                let items = self
                    .addedResponsibilities
                    .filter((addedResponsibility) => addedResponsibility.id === responsibility.id);

                if (items && items.length)
                    return;

                self.addedResponsibilities.push(responsibility);

                // Clear addSkillModel.
                self.addResponsibilityModel = null;
            },

            /*
            * Delete responsibility from local list.
            * */
            deleteLocalResponsibility(responsibility) {
                // Responsibility is invalid.
                if (!responsibility)
                    return;

                // Get current context.
                let self = this;
                let iItemIndex = self.addedResponsibilities.indexOf(responsibility);
                if (iItemIndex < 0)
                    return;

                self.addedResponsibilities
                    .splice(iItemIndex, 1);
            },

            /*
            * Called when ok button is clicked.
            * */
            vOnClickOk() {
                // Get current context.
                let self = this;

                // Copy model to local instance.
                let project = {};
                project = Object.assign({}, self.project);
                if (self.addedResponsibilities)
                    project['responsibilities'] = [].concat(self.addedResponsibilities);

                if (self.addedSkills)
                    project['skills'] = [].concat(self.addedSkills);

                project.startedTime = self.$moment(project.startedTime, 'YYYY/MM/DD').unix();
                project.finishedTime = self.$moment(project.finishedTime, 'YYYY/MM/DD').unix();
                self.$emit('click-ok', project);
            },
        },
        mounted() {
            // Get current context.
            let self = this;

            // Get project information.
            let pGetProjectPromise = null;
            if (self.projectProperty != null) {
                pGetProjectPromise = new Promise(resolve => {
                    let projectProperty = self.projectProperty;
                    if (projectProperty instanceof Function) {
                        resolve(projectProperty());
                        return;
                    } else if (projectProperty instanceof Promise) {
                        resolve(projectProperty);
                        return;
                    }

                    resolve(projectProperty);
                });
            } else {
                pGetProjectPromise = new Promise(resolve => {
                    resolve({
                        id: null,
                        name: null,
                        description: null,
                        startedTime: null,
                        finishedTime: null
                    });
                })
            }

            pGetProjectPromise
                .then((project) => {
                    self.project = Object.assign({}, project);
                    if (project.responsibilities)
                        self.addedResponsibilities = [].concat(project.responsibilities);

                    if (project.skills)
                        self.addedSkills = [].concat(project.skills);

                    self.project.startedTime = this.$moment.unix(project.startedTime).format('YYYY/MM/DD');
                    self.project.finishedTime = this.$moment.unix(project.finishedTime).format('YYYY/MM/DD');
                });
        }
    }
</script>

<style scoped>

</style>