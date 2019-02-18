<template>
    <div>
        <div class="col-lg-12">
            <!--Timeline-->
            <ul class="timeline">
                <li class="root">
                    <div class="timeline-badge info"
                         v-if="bHasPreviousProject"
                         @click="loadPreviousProjects()">
                        <i class="fa fa-arrow-up"></i>
                    </div>
                </li>

                <li v-for="(project, index) in projects"
                    :class="{'timeline-inverted': (index % 2 !== 0)}">
                    <div class="timeline-badge success"><i class="fa fa-leaf"></i></div>
                    <div class="timeline-panel">
                        <div class="timeline-heading">
                            <h4 class="timeline-title">{{project.name}}</h4>
                            <p>
                                <small class="text-muted"><i class="glyphicon glyphicon-time"></i>
                                    {{project.startedTime | moment("MMMM Do YYYY")}} - {{project.finishedTime |
                                    moment("MMMM Do YYYY")}}
                                </small>
                            </p>
                        </div>
                        <div class="timeline-body">
                            <!--Responsibilities list-->
                            <div class="form-group">
                                <ul>
                                    <li class="list-none">
                                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;<label>Responsibilities</label>
                                    </li>
                                    <li class="list-none">
                                        <ul>
                                            <li v-for="responsibility in project.responsibilities">
                                                {{responsibility.name}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <!--Skills list-->
                            <div class="form-group">
                                <ul>
                                    <li class="list-none">
                                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;<label>Skills</label>
                                    </li>
                                    <li class="list-none">
                                        <ul>
                                            <li v-for="skill in project.skills">
                                                {{skill.name}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <!--Project toolbar-->
                            <div class="form-group"
                                 v-if="bIsAbleToAddEditProject">
                                <div class="pull-right">
                                    <div class="btn-group"
                                         role="group">
                                        <button type="button"
                                                class="btn btn-default dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false">
                                            Action
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li @click="vOnEditProjectClick(project)">
                                                <a href="javascript:void(0);">
                                                    <span class="fa fa-edit"></span> Edit project
                                                </a>
                                            </li>
                                            <li @click="deleteProject(project.id)">
                                                <a href="javascript:void(0);">
                                                    <span class="fa fa-trash text-danger"></span> Delete project
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                <li class="treetop">
                    <div class="timeline-badge info"
                         v-if="bHasNextProject"
                         @click="loadNextProject()">
                        <i class="fa fa-arrow-down"></i>
                    </div>
                </li>
            </ul>

            <!--Toolbar button-->
            <div class="scroll-to-top"
                 v-if="bIsAbleToAddEditProject">
                <button class="btn btn-primary"
                        @click="vOnAddProjectClick()">
                    <span class="fa fa-plus"></span>
                </button>
            </div>
        </div>

        <!--User profile selector-->
        <modal :header="false"
               :footer="false"
               v-model="bIsAddEditProjectModalVisible"
               v-if="bIsAddEditProjectModalVisible"
               class="replace-body">
            <div slot="default">
                <add-profile-project @click-ok="vOnProjectAddEdit"
                                     :project-property="oSelectedProject"></add-profile-project>
            </div>
        </modal>

    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator'
    import {Profile} from "../../../models/profile";
    import {Action, Getter, Mutation} from "vuex-class";
    import {SearchResult} from "../../../models/search-result";
    import {Project} from "../../../models/project";
    import {LoadProjectViewModel} from "../../../view-model/project/load-project.view-model";
    import {ProjectViewModel} from "../../../view-model/project/project.view-model";
    import {PaginationConstant} from "../../../constants/pagination.constant";
    import {Pagination} from "../../../models/pagination";

    import '../../../styles/timeline.css';
    import '../../../styles/button.css';

    import AddEditProjectComponent from '../project/add-profile-project.vue';
    import {AddProjectViewModel} from "../../../view-model/project/add-project.view-model";
    import {EditProjectViewModel} from "../../../view-model/project/edit-project.view-model";
    import {getTotalPage} from "../../../functions/get-total-page.function";

    import toastr from 'toastr';

    @Component({
        components: {
            AddEditProjectComponent
        }
    })
    export default class ProfileProjectComponent extends Vue {

        //#region Properties

        /*
        * User id property.
        * */
        @Prop(Number)
        public userIdProperty: number;

        /*
        * User id.
        * */
        public userId: number = 0;

        /*
        * Profile state.
        * */
        @Getter('profile', {namespace: 'app'})
        public profile: Profile;

        /*
        * Load project result.
        * */
        public loadProjectResult: SearchResult<Project[]> = new SearchResult<Project[]>();

        /*
        * Load project conditions.
        * */
        public loadProjectCondition: LoadProjectViewModel = new LoadProjectViewModel();

        /*
        * Whether add/edit project modal is visible or not.
        * */
        public bIsAddEditProjectModalVisible: boolean = false;

        /*
        * The project which has been selected for editing.
        * */
        public oSelectedProject: ProjectViewModel = new ProjectViewModel();

        /*
        * Projects that has been loaded from api end-point.
        * */
        public get projects(): Array<Project> {

            // Load project result.
            let loadProjectResult = this.loadProjectResult;
            if (!this.loadProjectResult)
                return new Array<Project>();

            return loadProjectResult.records;
        }

        /*
        * Check whether more projects can be loaded or not.
        * */
        public get bHasNextProject(): boolean {
            // Get project search condition.
            if (!this.loadProjectCondition)
                return false;

            // Get pagination information.
            let pagination = this.loadProjectCondition.pagination;
            if (!pagination || !pagination.records)
                return false;

            if (!this.loadProjectResult)
                return false;

            // Get total records.
            let totalRecords = this.loadProjectResult.total;
            if (!totalRecords)
                return false;

            if ((pagination.page * pagination.records) >= totalRecords)
                return false;

            return true;
        }

        /*
        * Check whether previous project can be loaded or not.
        * */
        public get bHasPreviousProject(): boolean {
            if (!this.loadProjectResult)
                return false;

            // Get pagination information.
            let pagination = this.loadProjectCondition.pagination;
            if (pagination.page <= 1)
                return false;

            return true;
        }

        /*
        * Check whether user is able to add/edit project.
        * */
        public get bIsAbleToAddEditProject(): boolean {

            if (!this.userId)
                return false;

            if (!this.profile)
                return false;

            let profile: Profile = this.profile;
            if (!profile || profile.id !== this.userId)
                return false;

            return true;
        }

        /*
        * Total page that will be displayed on screen.
        * */
        public get totalPage(): number {
            let loadProjectResult: SearchResult<Project[]> = this.loadProjectResult;
            if (!loadProjectResult)
                return 1;

            let loadProjectCondition: LoadProjectViewModel = this.loadProjectCondition;
            if (!loadProjectResult)
                return 1;

            return getTotalPage(loadProjectResult.total, loadProjectCondition.pagination.records);
        }

        //#endregion

        //#region Constructors

        /*
        * Initialize component with settings.
        * */
        public constructor() {
            super();
            this.loadProjectCondition = new LoadProjectViewModel();
            this.loadProjectCondition.pagination = new Pagination();
            this.loadProjectCondition.pagination.records = PaginationConstant.dashboardMaxItem;
        }

        //#endregion

        //#region Methods

        /*
        * Add loading screen to UI.
        * */
        @Mutation('addLoadingScreen', {namespace: 'app'})
        public addLoadingScreen: () => void;

        /*
        * Delete loading screen from UI.
        * */
        @Mutation('deleteLoadingScreen')
        public deleteLoadingScreen: () => void;

        @Action('loadProjects')
        public loadProjectsAsync: (conditions: LoadProjectViewModel) => Promise<SearchResult<Project[]>>;

        @Action('deleteProject')
        public deleteProjectAsync: (id: number) => Promise<void>;

        @Action('addProject')
        public addProjectAsync: (addProjectModel: AddProjectViewModel) => Promise<Project>;

        @Action('editProject')
        public editProjectAsync: (editProjectModel: EditProjectViewModel) => Promise<Project>;

        /*
        * Load user projects by using specific conditions.
        * */
        public loadProjects(loadProjectCondition: LoadProjectViewModel): Promise<SearchResult<Project[]>> {
            let condition: LoadProjectViewModel = loadProjectCondition;
            if (condition == null)
                condition = this.loadProjectCondition;

            return this
                .loadProjectsAsync(condition)
                .then((loadProjectResult: SearchResult<Project[]>) => {
                    return loadProjectResult;
                });
        }

        /*
        * Load previous projects.
        * */
        public loadPreviousProjects(): void {

            // No previous page is available.
            if (!this.bHasPreviousProject)
                return;

            // Decrease page by 1.
            this.loadProjectCondition.pagination.page--;

            // Add loading screen.
            this.addLoadingScreen();

            this.loadProjects(null)
                .then((loadProjectsResult: SearchResult<Project[]>) => {
                    // Scroll to top.
                    this.loadProjectResult = loadProjectsResult;
                    return loadProjectsResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Load more projects.
        * */
        public loadNextProject(): void {

            // Has next projects.
            if (!this.bHasNextProject)
                return;

            // Get loading condition.
            this.loadProjectCondition.pagination.page++;

            // Add loading screen.
            this.addLoadingScreen();
            this.loadProjects(null)
                .then((loadProjectResult: SearchResult<Project[]>) => {
                    this.loadProjectResult = loadProjectResult;
                    return true;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Delete user project.
        * */
        public deleteProject(id): void {
            // Freeze the ui.
            this.addLoadingScreen();

            this.deleteProjectAsync(id)
                .then(() => {
                    toastr.success('Project has been deleted successfully');
                    return this.loadProjects(null);
                })
                .then((loadProjectResult: SearchResult<Project[]>) => {
                    this.loadProjectResult = loadProjectResult;
                    return loadProjectResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when add project button is clicked.
        * */
        public vOnAddProjectClick(): void {
            // Clear project information.
            this.oSelectedProject = null;

            // Display add project model.
            this.bIsAddEditProjectModalVisible = true;
        }

        /*
        * Called when a project is confirmed to be added/edited.
        * */
        public vOnProjectAddEdit(project: ProjectViewModel): void {

            // Project is invalid.
            if (!project) {
                this.bIsAddEditProjectModalVisible = false;
                return;
            }

            let responsibilityIds = null;
            let skillIds = null;

            // Project responsibilities is valid.
            if (project.responsibilities) {
                responsibilityIds = project.responsibilities
                    .map((responsibility) => responsibility.id);
            }

            // Project skills is valid.
            if (project.skills) {
                skillIds = project.skills
                    .map((skill) => skill.id);
            }

            // Add a loading screen.
            this.addLoadingScreen();

            // Project is is not defined. That means user is adding a new project to system.
            if (!project.id) {

                let addProjectModel = new AddProjectViewModel();
                addProjectModel.userId = this.userId;
                addProjectModel.name = project.name;
                addProjectModel.description = project.description;
                addProjectModel.startedTime = project.startedTime;
                addProjectModel.finishedTime = project.finishedTime;
                addProjectModel.responsibilityIds = responsibilityIds;
                addProjectModel.skillIds = skillIds;

                this.addProjectAsync(addProjectModel)
                    .then(() => {
                        // Hide the modal dialog.
                        this.bIsAddEditProjectModalVisible = false;
                        return true;
                    })
                    .finally(() => {
                        this.deleteLoadingScreen();
                    });

                return;
            }

            let editProjectModel = new EditProjectViewModel();
            editProjectModel.id = project.id;
            editProjectModel.name = project.name;
            editProjectModel.description = project.description;
            editProjectModel.startedTime = project.startedTime;
            editProjectModel.finishedTime = project.finishedTime;
            editProjectModel.responsibilityIds = responsibilityIds;
            editProjectModel.skillIds = skillIds;

            this.editProjectAsync(editProjectModel)
                .then(() => {
                    // Hide the modal dialog.
                    this.bIsAddEditProjectModalVisible = false;
                    return true;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when edit project button is clicked.
        * */
        public vOnEditProjectClick(project: ProjectViewModel): void {
            this.oSelectedProject = project;

            // Display the edit project modal.
            this.bIsAddEditProjectModalVisible = true;
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {
            this.userId = this.userIdProperty;
            this.loadProjectCondition.userIds = [this.userId];

            // Block app UI.
            this.addLoadingScreen();

            this
                .loadProjects(null)
                .then((loadProjectResult: SearchResult<Project[]>) => {
                    this.loadProjectResult = loadProjectResult;
                    return true;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        //#endregion
    }
</script>

<style scoped>

    li.list-none {
        display: block;
    }
</style>