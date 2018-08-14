<template>
    <div>
        <!--Skills list-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <table class="table table-condensed table-responsive">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Created time</th>
                            <th v-if="bIsUserAdmin"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="skills && skills.length"
                            v-for="skill in skills">
                            <td class="text-center">{{skill.name}}</td>
                            <td class="text-center">{{skill.createdTime}}</td>

                            <td class="text-center"
                                v-if="bIsUserAdmin">
                                <button class="btn btn-info"
                                        v-on:click="vOnEditSkillClicked(skill)">
                                    <i class="glyphicon glyphicon-pencil"></i>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-danger"
                                        v-on:click="vOnDeleteSkillClicked(skill)">
                                    <i class="glyphicon glyphicon-remove"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!skills || !skills.length">
                            <td colspan="5"
                                class="text-center">
                                <i class="text-danger">No information is available.</i>
                            </td>
                        </tr>
                        <tr v-if="bIsUserAdmin">
                            <td colspan="5">
                                <div class="pull-right">
                                    <button class="btn btn-primary"
                                            v-on:click="vOnAddSkillClicked()">
                                        <i class="glyphicon glyphicon-plus"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!--Skill search pagination-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <pagination v-model="loadSkillCondition.pagination.page"
                                :total-page="loadSkillResult.total"
                                align="center"
                                :boundary-links="true"
                                :direction-links="true"
                                @change="vOnLoadSkillPageChange($event)">
                    </pagination>
                </div>
            </div>
        </div>

        <!--Add/edit skill-->
        <modal :header="false"
               :footer="false"
               size="md"
               v-model="bIsSkillModalOpened"
               v-if="bIsSkillModalOpened"
               class="replace-body">
            <div slot="default">
                <skill-detail :skill-property="skill"
                              v-on:confirm="addEditSkill($event)"
                              v-on:cancel="bIsSkillModalOpened = false">
                </skill-detail>
            </div>
        </modal>

        <!--Skill delete confirmation-->
        <modal :header="false"
               size="md"
               v-model="bIsDeleteSkillModalOpened"
               v-if="bIsDeleteSkillModalOpened"
               class="replace-body">
            <div slot="default">
                <div class="text-center">
                    <i class="text-danger">Are you sure to delete <b class="text-danger">{{skill.name}}</b> from system
                        ?</i>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            @click="deleteSkill(skill)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            v-on:click="bIsDeleteSkillModalOpened = false">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

    // Import skill detail component.
    import SkillDetail from '../skill/skill-detail';
    import {mapMutations} from 'vuex';
    import {mapGetters} from 'vuex';

    export default {
        name: 'skill-dashboard',
        dependencies: ['paginationConstant', '$skill', '$toastr', 'userRoleConstant'],
        data() {
            return {

                /*
                * Skills search result.
                * */
                loadSkillResult: {
                    records: [],
                    total: 0
                },

                /*
                * Load skill condition.
                * */
                loadSkillCondition:{
                    pagination:{
                        page: 1,
                        records: this.paginationConstant.dashboardMaxItem
                    }
                },

                skill: null,
                bIsSkillModalOpened: false,
                bIsDeleteSkillModalOpened: false
            }
        },
        computed: {

            ...mapGetters([
                'profile'
            ]),

            /*
            * Check whether user is admin.
            * */
            bIsUserAdmin() {
                if (!this.profile)
                    return false;

                let profile = this.profile();
                if (!profile)
                    return false;

                return profile.role === this.userRoleConstant.admin;
            },

            /*
            * List of skills loaded from api end-point
            * */
            skills() {
                if (!this.loadSkillResult || !this.loadSkillResult.records || this.loadSkillResult.total < 1)
                    return [];

                return this.loadSkillResult.records;
            }
        },
        mounted() {

            // Get current function context.
            let self = this;

            // Block UI.
            self.addLoadingScreen();

            self.loadSkills()
                .then((loadSkillsResult) => {
                    self.loadSkillResult = loadSkillsResult;
                    self.deleteLoadingScreen();
                });

        },
        methods: {

            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Called when edit skill button is clicked.
            * */
            vOnEditSkillClicked(skill) {
                this.skill = skill;
                this.bIsSkillModalOpened = true;
            },

            /*
            * Called when add skill button is clicked.
            * */
            vOnAddSkillClicked() {
                this.skill = {};
                this.bIsSkillModalOpened = true;
            },

            /*
            * Called when skill button is clicked.
            * */
            vOnDeleteSkillClicked(skill) {
                this.skill = skill;
                this.bIsDeleteSkillModalOpened = true;
            },

            /*
            * Called when skill is confirmed to be edited.
            * */
            addEditSkill(skill) {

                // Edit/add user promise.
                let pAddEditSkillPromise = null;

                // Get function context.
                let self = this;

                // Add loading screen.
                self.addLoadingScreen();

                if (!skill.id) {
                    pAddEditSkillPromise = this.$skill
                        .addSkill(skill.name)
                        .then(() => {
                            self.$toastr.success('Skill has been added to system.');
                        });
                } else {
                    pAddEditSkillPromise = this.$skill
                        .editSkill(skill.id, skill.name)
                        .then(() => {
                            self.$toastr.success('Skill has been edited.')
                        });
                }

                pAddEditSkillPromise
                    .then(() => {
                        self.bIsSkillModalOpened = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    })
            },

            /*
            * Delete skill from system.
            * */
            deleteSkill(skill) {
                if (!skill || !skill.id) {
                    this.bIsDeleteSkillModalOpened = false;
                    return;
                }

                // Get context.
                let self = this;

                // Add loading screen.
                self.addLoadingScreen();

                // Call api to delete skill.
                this.$skill
                    .deleteSkill(skill.id)
                    .then(() => {
                        self.$toastr.success('Skill has been removed !');

                        // Close modal dialog.
                        self.bIsDeleteSkillModalOpened = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Load skill using global conditions.
            * */
            loadSkills() {

                // Get current class context.
                let self = this;

                let loadSkillCondition = this.loadSkillCondition;
                let pagination = loadSkillCondition.pagination;

                return self.$skill
                    .loadSkills(null, null, null, pagination.page, pagination.records)
                    .catch(() => {
                        return {
                            records: [],
                            total: 0
                        }
                    });
            },

            /*
            * Called when pagination of load skill panel is clicked.
            * */
            vOnLoadSkillPageChange(){

                let self = this;

                // Block UI.
                self.addLoadingScreen();

                self.loadSkills()
                    .then((loadSkillResult) => {
                        self.loadSkillResult = loadSkillResult;
                        self.deleteLoadingScreen();
                    });
            }
        },
        components: {
            SkillDetail
        }
    }
</script>

<style scoped>

</style>