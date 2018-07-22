<template>
    <div>
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
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="project in projects">
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
                            <div v-for="skill in project.skills"
                                 class="text-center">
                                {{skill.name}}
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-danger"
                                    @click="deleteProject(project.id)">
                                <span class="fa fa-trash"></span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

    import {mapMutations} from 'vuex';

    export default {
        name: 'user-project-dashboard',
        dependencies: ['$project', '$lodash', '$toastr'],
        props: {
            userIdProperty: null
        },
        data() {
            return {
                userId: null,
                loadProjectResult: {
                    records: [],
                    total: 0
                }
            }
        },
        computed: {
            projects() {
                // Get current context.
                let self = this;
                if (!self.loadProjectResult)
                    return [];

                return self.loadProjectResult.records;
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
                    .loadProjects(null, [self.userId], null, null, null, null, null, true, true)
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
        }
    }
</script>

<style scoped>

</style>