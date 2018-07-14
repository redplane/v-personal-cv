<template>
    <div>

        <!--Skills list-->
        <table class="table table-condensed table-responsive">
            <thead>
            <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Created time</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="skills && skills.length"
                v-for="skill in skills">
                <td class="text-center">{{skill.name}}</td>
                <td class="text-center">{{skill.createdTime}}</td>

                <td class="text-center">
                    <button class="btn btn-info"
                            v-on:click="vOnEditSkillClicked(skill)">
                        <i class="glyphicon glyphicon-pencil"></i>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-danger">
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
            <tr>
                <td colspan="5">
                    <div class="pull-right">
                        <button class="btn btn-primary"
                                v-on:click="vOnAdSkillClicked()">
                            <i class="glyphicon glyphicon-plus"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

        <!--Add/edit skill-->
        <modal :header="false"
               :footer="false"
               size="lg"
               v-model="bIsSkillModalOpened"
               v-if="bIsSkillModalOpened">
            <div slot="default">
                <skill-detail :skill-property="skill"
                              v-on:confirm="addEditSkill(skill)"
                              v-on:cancel="bIsSkillModalOpened = false">
                </skill-detail>
            </div>
        </modal>
    </div>

</template>

<script>

    // Import skill detail component.
    import SkillDetail from "./skill-detail";

    const SkillDetailComponent = require('./skill-detail');

    export default {
        name: 'skill-dashboard',
        dependencies: ['paginationConstant', '$skill'],
        data() {
            return {
                skill: null,
                skills: [],
                bIsSkillModalOpened: false
            }
        },
        mounted() {

            // Get current function context.
            let self = this;

            // Find skills by using specific conditions.
            let loadSkillCondition = {
                pagination: {
                    page: 1,
                    records: this.paginationConstant.dashboardMaxItem
                }
            };

            this.$skill
                .getSkills(loadSkillCondition)
                .then((loadSkillsResult) => {
                    self.skills = loadSkillsResult.records;
                });
        },
        methods: {

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
            vOnAdSkillClicked(){
                this.skill = {};
                this.bIsSkillModalOpened = true;
            },

            /*
            * Called when skill is confirmed to be edited.
            * */
            addEditSkill(skill){

                // Edit/add user promise.
                let pAddEditSkillPromise = null;

                // Get function context.
                let self = this;

                if (!skill.id) {
                    pAddEditSkillPromise = this.$skill
                        .addSkill(skill)
                        .then(() => {
                            self.$toastr.success('Skill has been added to system.');
                        })
                        .catch(() => {});
                } else {
                    pAddEditSkillPromise = this.$skill
                        .editSkill(skill.id, skill)
                        .then(() => {
                            self.$toastr.success('Skill has been edited.')
                        })
                        .catch(() => {});
                }

                pAddEditSkillPromise
                    .then(() => {
                        self.bIsSkillModalOpened = false;
                    })
            }
        },
        components: {
            SkillDetail,
            SkillDetailComponent
        }
    }
</script>

<style scoped>

</style>