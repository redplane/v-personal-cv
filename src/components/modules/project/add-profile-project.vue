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

<script lang="ts">

    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {Project} from "../../../models/project";
    import {Responsibility} from "../../../models/responsibility";
    import {Skill} from "../../../models/skill";
    import {LoadResponsibilityViewModel} from "../../../view-model/load-responsibility.view-model";
    import {SearchResult} from "../../../models/search-result";
    import {Action} from "vuex-class";
    import {LoadSkillViewModel} from "../../../view-model/skill/load-skill.view-model";
    import {Pagination} from "../../../models/pagination";
    import {PaginationConstant} from "../../../constants/pagination.constant";

    import {cloneDeep} from 'lodash';
    import {ProjectViewModel} from "../../../view-model/project/project.view-model";
    import * as moment from 'moment';
    import {unix} from 'moment';

    @Component({
        name: 'add-profile-project'
    })
    export default class AddEditProfileComponent extends Vue {

        //#region Properties

        // Project information.
        private project: Project;

        // Input project property.
        @Prop(Object)
        private projectProperty: Project;

        // List of added responsibilities
        private addedResponsibilities: Responsibility[];

        // List of added skills.
        private addedSkills: Skill[];

        /*
        * Information of skill that will be added into project.
        * */
        private addSkillModel: any;

        /*
        * Information of responsibility will be added into project.
        * */
        private addResponsibilityModel: any;

        /*
        * Whether user can add skill or not.
        * */
        public get bIsAbleToAddSkill(): boolean {
            if (!this.addSkillModel)
                return false;

            if (!this.addSkillModel.id)
                return false;

            return true;
        }

        /*
        * Whether user can add responsibility or not.
        * */
        public get bIsAbleToAddResponsibility(): boolean {
            if (!this.addResponsibilityModel)
                return false;

            if (!this.addResponsibilityModel.id)
                return false;

            return true;
        }

        //#endregion

        //#region Constructor

        /*
        * Initialize component.
        * */
        public constructor() {
            super();
            this.project = new Project();
            this.addedResponsibilities = new Array<Responsibility>();
            this.addResponsibilityModel = new Responsibility();
            this.addSkillModel = new Skill();
            this.addedSkills = new Array<Skill>();
        }

        //#endregion

        //#region Methods

        @Action('loadResponsibilities', {namespace: 'apiResponsibility'})
        private loadResponsibilitiesAsync: (condition: LoadResponsibilityViewModel) => Promise<SearchResult<Responsibility[]>>;

        @Action('loadSkills', {namespace: 'apiSkill'})
        private loadSkillsAsync: (condition: LoadSkillViewModel) => Promise<SearchResult<Skill[]>>;

        /*
        * Called when user is querying a skill.
        * */
        public vOnSkillQueried(query: string, done: (skills: Skill[]) => void): void {

            let loadSkillsCondition = new LoadSkillViewModel();
            loadSkillsCondition.names = query ? [query] : null;
            loadSkillsCondition.pagination = new Pagination();
            loadSkillsCondition.pagination.page = 1;
            loadSkillsCondition.pagination.records = PaginationConstant.typeaheadMaxItem;


            this.loadSkillsAsync(loadSkillsCondition)
                .then((loadSkillsResult: SearchResult<Skill[]>) => {
                    done(loadSkillsResult.records);
                })
                .catch(() => {
                    done([]);
                });
        }

        /*
        * Called when user is querying a responsibility
        * */
        public vOnResponsibilityQueried(query: string, done: (responsibilities: Responsibility[]) => void): void {

            let loadResponsibilitiesCondition = {
                names: query ? [query] : null,
                pagination: {
                    page: 1,
                    records: PaginationConstant.typeaheadMaxItem
                }
            };

            this.loadResponsibilitiesAsync(loadResponsibilitiesCondition)
                .then((loadResponsibilityResult: SearchResult<Responsibility[]>) => {
                    done(loadResponsibilityResult.records);
                })
                .catch(() => {
                    done([]);
                });
        }

        /*
        * Add skill to local list.
        * */
        public addLocalSkill(skill: Skill): void {
            // Skill is invalid.
            if (!skill)
                return;

            // Find added item.
            let items = this.addedSkills
                .filter((addedSkill) => addedSkill.id === skill.id);

            if (items && items.length)
                return;

            this.addedSkills.push(skill);

            // Clear addSkillModel.
            this.addSkillModel = null;
        }

        /*
        * Delete skill from list locally.
        * */
        public deleteLocalSkill(skill: Skill): void {
            // Skill is invalid.
            if (!skill)
                return;

            // Get current context.
            let iItemIndex = this.addedSkills.indexOf(skill);
            if (iItemIndex < 0)
                return;

            this.addedSkills
                .splice(iItemIndex, 1);
        }

        /*
        * Add responsibility to local list.
        * */
        public addLocalResponsibility(responsibility: Responsibility): void {
            // Responsibility is invalid.
            if (!responsibility)
                return;

            // Find the added item.
            let items = this
                .addedResponsibilities
                .filter((addedResponsibility) => addedResponsibility.id === responsibility.id);

            if (items && items.length)
                return;

            this.addedResponsibilities.push(responsibility);

            // Clear addSkillModel.
            this.addResponsibilityModel = null;
        }

        /*
        * Delete responsibility from local list.
        * */
        public deleteLocalResponsibility(responsibility: Responsibility) {
            // Responsibility is invalid.
            if (!responsibility)
                return;

            // Get current context.
            let iItemIndex = this.addedResponsibilities.indexOf(responsibility);
            if (iItemIndex < 0)
                return;

            this.addedResponsibilities
                .splice(iItemIndex, 1);
        }

        /*
        * Called when ok button is clicked.
        * */
        public vOnClickOk(): void {

            // Copy model to local instance.
            let project = <ProjectViewModel> cloneDeep(this.project);

            if (this.addedResponsibilities)
                project['responsibilities'] = [].concat(this.addedResponsibilities);

            if (this.addedSkills)
                project['skills'] = [].concat(this.addedSkills);

            project.startedTime = unix(project.startedTime).valueOf();
            project.finishedTime = unix(project.finishedTime).valueOf();
            this.$emit('click-ok', project);
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {

            // Get project information.
            let pGetProjectPromise = null;
            if (this.projectProperty != null) {
                pGetProjectPromise = new Promise(resolve => {
                    let projectProperty = this.projectProperty;
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
                    this.project = Object.assign({}, project);
                    if (project.responsibilities)
                        this.addedResponsibilities = [].concat(project.responsibilities);

                    if (project.skills)
                        this.addedSkills = [].concat(project.skills);

                    this.project.startedTime = unix(project.startedTime).valueOf();
                    this.project.finishedTime = unix(project.finishedTime).valueOf();
                });
        }

        //#endregion
    }
</script>

<style scoped>

</style>