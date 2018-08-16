<template>
    <div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <span>Add user technique</span>
                </h3>
            </div>
            <div class="panel-body">
                <!--Skills list-->
                <div class="form-group">
                    <table class="table table-condensed table-striped">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Created time</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="bIsLoadingSkills">
                            <td colspan="3" class="text-center">Data is being fetched ....</td>
                        </tr>
                        <tr v-else
                            v-for="skill in loadSkillResult.records">
                            <td>
                                <input type="checkbox"
                                       v-model="selectedSkillMap[skill.id]"
                                       v-bind:value="skill"/>
                            </td>
                            <td>
                                {{skill.name}}
                            </td>
                            <td>
                                {{skill.createdTime}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <!--Pagination-->
                <div class="form-group">
                    <pagination v-model="loadSkillCondition.pagination.page"
                                :total-page="totalSkillPage"
                                align="center"
                                :boundary-links="true"
                                :direction-links="true"
                                @change="vOnPageChanged($event)">
                    </pagination>
                </div>
            </div>
            <div class="panel-footer">
                <div class="text-center">
                    <button class="btn btn-primary"
                            :class="{'hidden': bIsLoadingSkills}"
                            @click="vOnModalConfirm()">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="vOnModalCancel()">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'skill-selector',
        dependencies: ['paginationConstant', '$skill', '$lodash', '$ui'],
        props: {
            skillCategoryProperty: null
        },
        data() {
            return {
                skillCategory: null,

                /*
                * Condition to load skills.
                * */
                loadSkillCondition: {
                    pagination: {
                        page: 1,
                        records: this.paginationConstant.selectorMaxItem
                    }
                },

                /*
                * Load skill result.
                * */
                loadSkillResult: {
                    records: [],
                    total: 0
                },

                selectedSkillMap: {},

                // Check whether skills are being loaded or not.
                bIsLoadingSkills: false,
            }
        },
        mounted() {
            // Get current context.
            let self = this;
            self.vOnPageChanged(1);
        },
        methods: {
            /*
            * Load skill using specific condition.
            * */
            loadSkills() {
                // Get context.
                let self = this;

                return self.$skill
                    .loadSkills(self.loadSkillCondition);
            },

            /*
            * Called when page is changed.
            * */
            vOnPageChanged() {

                let self = this;
                let promises = [];

                // Set loading flag to be true.
                self.bIsLoadingSkills = true;

                // Load skill category.
                promises[0] = new Promise(resolve => {
                    resolve(self.skillCategoryProperty);
                });

                // Load skills.
                promises[1] = self.loadSkills();

                // Load selected skill.

                Promise.all(promises)
                    .then((loadRecordResponses) => {
                        let skillCategory = Object.assign({}, loadRecordResponses[0]);
                        let loadSkillResult = loadRecordResponses[1];

                        // Get skills.
                        let skills = loadSkillResult.records;
                        let skillIds = skills.map((skill) => skill.id);

                        let loadSkillCategoryCondition = {
                            userIds: [skillCategory.userId],
                            skillCategoryIds: [skillCategory.id],
                            skillIds: skillIds
                        };

                        self.$skill
                            .loadSkillCategorySkillRelationships(loadSkillCategoryCondition)
                            .then((loadSkillCategorySkillResult) => {
                                self.skillCategory = Object.assign({}, skillCategory);
                                self.loadSkillResult = loadSkillResult;

                                // Get relationships.
                                let relationships = loadSkillCategorySkillResult.records;
                                let pRelationshipMap = {};
                                self.$lodash.each(relationships, (relationship) => {
                                    pRelationshipMap[relationship.skillId] = relationship;
                                });

                                self.selectedSkillMap = pRelationshipMap;
                            })
                    })
                    .finally(() => {
                        self.bIsLoadingSkills = false;
                    });
            },

            /*
            * Called when cancel button is clicked.
            * */
            vOnModalCancel() {
                this.$emit('cancel');
            },

            /*
            * Called when ok button is clicked.
            * */
            vOnModalConfirm() {
                // Get context.
                let self = this;

                // Get selected skill ids.
                let map = self.selectedSkillMap;
                let ids = Object.keys(map).map((id) => parseInt(id));
                this.$emit('select-skill', self.skillCategory.id, ids);
            }
        },
        computed: {

            /*
            * Calculate total skill page to display.
            * */
            totalSkillPage(){
                return this.$ui.loadPageCalculation(this.loadSkillResult.total, this.loadSkillCondition.pagination.records);
            }
        }
    }
</script>

<style scoped>

</style>