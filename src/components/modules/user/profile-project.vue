<template>
    <div>
        <div class="col-lg-12">
            <!--Timeline-->
            <ul class="timeline">
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

                            <div class="form-group">
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
                                            <li>
                                                <a href="javascript:void(0);">
                                                    <span class="fa fa-plus"></span> Add responsibility
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0);">
                                                    <span class="fa fa-plus"></span> Add skill
                                                </a>
                                            </li>
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

                <li>
                    <div class="timeline-badge info">
                        <i class="fa fa-ellipsis-h"></i>
                    </div>
                </li>
            </ul>

            <!--Toolbar button-->
            <div class="scroll-to-top">
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

<script>

    import {mapMutations} from 'vuex';
    import AddProfileProject from '../project/add-profile-project';
    import '../../../styles/timeline.css';
    import '../../../styles/button.css';

    export default {
        name: 'user-project-dashboard',
        dependencies: ['paginationConstant', '$project', '$lodash', '$ui', '$toastr'],
        props: {
            userIdProperty: null
        },
        data() {
            return {
                userId: null,

                /*
                * Load project result.
                * */
                loadProjectResult: {
                    records: [],
                    total: 0
                },

                /*
                * Load project condition.
                * */
                loadProjectCondition: {
                    userIds: [],
                    includeResponsibilities: true,
                    includeSkills: true,
                    pagination: {
                        page: 1,
                        records: this.paginationConstant.dashboardMaxItem
                    }
                },

                /*
                * Whether add/edit project modal is visible or not.
                * */
                bIsAddEditProjectModalVisible: false,

                /*
                * The project which has been selected for editing.
                * */
                oSelectedProject: null
            }
        },
        computed: {
            projects() {
                // Get current context.
                let self = this;
                if (!self.loadProjectResult)
                    return [];

                return self.loadProjectResult.records;
            },

            /*
            * Total page that will be displayed on screen.
            * */
            totalPage() {
                let self = this;
                return self.$ui.loadPageCalculation(self.loadProjectResult.total, self.loadProjectCondition.pagination.records)
            }
        },
        mounted() {

            // Get current class context.
            let self = this;

            // Block app UI.
            self.addLoadingScreen();

            // Get user id information.
            let pLoadDataPromise = new Promise(resolve => {
                resolve(self.userIdProperty);
            });

            pLoadDataPromise
                .then((userId) => {
                    self.userId = userId;
                    self.loadProjectCondition.userIds = [userId];
                })
                .then(() => {
                    return self.loadProjects();
                })
                .then((loadProjectResult) => {
                    self.loadProjectResult = loadProjectResult;
                })
                .finally(() => {
                    self.deleteLoadingScreen();
                });
        },
        methods: {

            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            // Map mutations from store.

            /*
            * Load project using specific conditions.
            * */
            /*
            * Load user projects by using specific conditions.
            * */
            loadProjects() {

                // Get context.
                let self = this;

                return self.$project
                    .loadProjects(self.loadProjectCondition)
                    .then((loadProjectResult) => {
                        return loadProjectResult;
                    });
            },

            /*
            * Delete user project.
            * */
            deleteProject(id) {
                let self = this;

                // Freeze the ui.
                self.addLoadingScreen();

                self.$project
                    .deleteProject(id)
                    .then(() => {
                        self.$toastr.success('Project has been deleted successfully');
                        return self.loadProjects();
                    })
                    .then((loadProjectResult) => {
                        self.loadProjectResult = loadProjectResult;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Find the max item between numbers.
            * */
            calculateMaxNumber(expression) {
                return Math.max(expression);
            },

            /*
            * Called when add project button is clicked.
            * */
            vOnAddProjectClick() {

                // Get current context.
                let self = this;

                // Display add project model.
                self.bIsAddEditProjectModalVisible = true;
            },

            /*
            * Called when a project is confirmed to be added/edited.
            * */
            vOnProjectAddEdit(project) {

                // Get current context.
                let self = this;

                if (!project) {
                    self.bIsAddEditProjectModalVisible = false;
                    return;
                }

                let responsibilityIds = null;
                let skillIds = null;

                if (project.responsibilities){
                    responsibilityIds = project.responsibilities
                        .map((responsibility) => responsibility.id);
                }

                if (project.skills){
                    skillIds = project.skills
                        .map((skill) => skill.id);
                }

                // Add a loading screen.
                self.addLoadingScreen();

                // Project is is not defined. That means user is adding a new project to system.
                if (!project.id) {
                    self.$project
                        .addProject(self.userId, project.name, project.description, project.startedTime, project.finishedTime, responsibilityIds, skillIds)
                        .then(() => {
                            // Hide the modal dialog.
                            self.bIsAddEditProjectModalVisible = false;
                        })
                        .finally(() => {
                            self.deleteLoadingScreen();
                        });

                    return;
                }

                self.$project
                    .editProject(project.id, self.userId, project.name, project.description, project.startedTime, project.finishedTime, responsibilityIds, skillIds)
                    .then(() => {
                        // Hide the modal dialog.
                        self.bIsAddEditProjectModalVisible = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when edit project button is clicked.
            * */
            vOnEditProjectClick(project){

                // Get current context.
                let self = this;

                self.oSelectedProject = project;

                // Display the edit project modal.
                self.bIsAddEditProjectModalVisible = true;
            }
        },
        components: {
            AddProfileProject
        }
    }
</script>

<style scoped>

    li.list-none {
        display: block;
    }
</style>