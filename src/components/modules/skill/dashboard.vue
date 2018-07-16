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
            <tr>
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

        <!--Add/edit skill-->
        <modal :header="false"
               :footer="false"
               size="md"
               v-model="bIsSkillModalOpened"
               v-if="bIsSkillModalOpened">
            <div slot="default">
                <skill-detail :skill-property="skill"
                              v-on:confirm="addEditSkill($event)"
                              v-on:cancel="bIsSkillModalOpened = false">
                </skill-detail>
            </div>
        </modal>

        <modal :header="false"
               size="md"
               v-model="bIsDeleteSkillModalOpened"
               v-if="bIsDeleteSkillModalOpened">
            <div slot="default">
                <div class="text-center">
                    <i class="text-danger">Are you sure to delete <b class="text-danger">{{skill.name}}</b> from system ?</i>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            v-on:click="deleteSkill(skill)">
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
    import SkillDetail from './skill-detail.vue';

    export default {
        name: 'skill-dashboard',
        dependencies: ['paginationConstant', '$skill', '$toastr'],
        data() {
            return {
                skill: null,
                skills: [],
                bIsSkillModalOpened: false,
                bIsDeleteSkillModalOpened: false
            }
        },
        mounted() {

            // Get current function context.
            let self = this;

            this.$skill
                .loadSkills()
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
            vOnAddSkillClicked(){
                this.skill = {};
                this.bIsSkillModalOpened = true;
            },

            /*
            * Called when skill button is clicked.
            * */
            vOnDeleteSkillClicked(skill){
                this.skill = skill;
                this.bIsDeleteSkillModalOpened = true;
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
            },

            /*
            * Delete skill from system.
            * */
            deleteSkill(skill){
                if (!skill || !skill.id){
                    this.bIsDeleteSkillModalOpened = false;
                    return;
                }

                // Get context.
                let self = this;

                // Call api to delete skill.
                this.$skill
                    .deleteSkill(skill.id)
                    .then(() => {
                        self.$toastr.success('Skill has been removed !');

                        // Close modal dialog.
                        self.bIsDeleteSkillModalOpened = false;
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