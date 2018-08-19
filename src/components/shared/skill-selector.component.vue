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
                            v-for="skill in loadedSkills">
                            <td>
                                <input type="checkbox"
                                       v-model="mSelectedSkillMap[skill.id]"
                                       v-bind:value="skill"/>
                            </td>
                            <td>
                                {{skill.name}} | {{skill.id}}
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

<script lang="ts">

    import {SkillCategory} from "../../models/skill-category";
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {LoadSkillViewModel} from "../../view-model/skill/load-skill.view-model";
    import {SearchResult} from "../../models/search-result";
    import {Skill} from "../../models/skill";
    import {SkillCategorySkillRelationship} from "../../models/skill-category-skill-relationship";
    import {Mutation} from "vuex-class";
    import {Pagination} from "../../models/pagination";
    import PaginationConstant from '../../constants/pagination.constant.vue';

    @Component({
        name: 'skill-selector',
        dependencies: ['$ui', '$lodash', '$skill']
    })
    export default class SkillSelectorComponent extends Vue {

        //#region Properties

        /*
        * Skill category instance.
        * */
        @Prop(Object)
        public skillCategoryProperty: SkillCategory;

        /*
        * Skill category instance.
        * */
        public skillCategory: SkillCategory;

        /*
        * Load skill condition.
        * */
        public loadSkillCondition: LoadSkillViewModel;

        /*
        * Load skill result.
        * */
        public loadSkillResult: SearchResult<Skill[]>;

        /*
        * Whether skill is being loaded or not.
        * */
        public bIsLoadingSkills: boolean;

        /*
        * Map of selected skill.
        * */
        private mSelectedSkillMap: { [id: number]: SkillCategorySkillRelationship; } = {};

        /*
        * Calculate total skill page to display.
        * */
        public get totalSkillPage(): number {
            let $ui = this.$ui;

            // Get skill result.
            let loadSkillResult: SearchResult<Skill[]> = this.loadSkillResult;
            if (!loadSkillResult)
                return 1;

            let loadSkillCondition: LoadSkillViewModel = this.loadSkillCondition;
            if (!loadSkillCondition || !loadSkillCondition.pagination || !loadSkillCondition.pagination.records)
                return 1;

            return $ui.loadPageCalculation(this.loadSkillResult.total, this.loadSkillCondition.pagination.records);
        }

        /*
        * List of skills that needs shown up on loading page.
        * */
        public get loadedSkills(): Array<Skill> {
            if (!this.loadSkillResult)
                return new Array<Skill>();

            return this.loadSkillResult.records;
        }

        //#endregion

        //#region Constructor

        /*
        * Initialize component with settings.
        * */
        public constructor() {
            super();
            this.bIsLoadingSkills = false;

            let pagination: Pagination = new Pagination();
            pagination.page = 1;
            pagination.records = PaginationConstant.selectorMaxItem;

            this.loadSkillCondition = new LoadSkillViewModel();
            this.loadSkillCondition.pagination = pagination;

            this.loadSkillResult = new SearchResult<Skill[]>();
        }

        //#endregion

        //#region Methods

        /*
        * Add loading screen to UI.
        * */
        @Mutation('addLoadingScreen')
        public addLoadingScreen: any;

        /*
        * Delete loading screen from UI.
        * */
        @Mutation('deleteLoadingScreen')
        public deleteLoadingScreen: any;


        /*
        * Load skill by using specific condition.
        * */
        public loadSkills(loadSkillCondition: LoadSkillViewModel): Promise<SearchResult<Skill[]>> {
            let condition: LoadSkillViewModel = loadSkillCondition;
            if (!condition)
                condition = this.loadSkillCondition;

            return this.$skill
                .loadSkills(condition)
                .catch(() => {
                    let loadSkillResult = new SearchResult<Skill[]>();
                    loadSkillResult.records = [];
                    loadSkillResult.total = 0;

                    return loadSkillResult;
                });
        }

        /*
        * Load selected skills map.
        * */
        public loadSelectedSkills(skillCategoryId: number): Promise<{ [id: number]: SkillCategorySkillRelationship }> {

            // Initialize search condition.
            let loadSkillCategorySkillRelationshipCondition = {
                skillCategoryIds: [skillCategoryId]
            };

            // Clear the selected list.
            this.mSelectedSkillMap = {};

            return this.$skill
                .loadSkillCategorySkillRelationships(loadSkillCategorySkillRelationshipCondition)
                .then((loadSkillCategorySkillRelationshipResult: SearchResult<SkillCategorySkillRelationship[]>) => {
                    // Get relationships.
                    let relationships = loadSkillCategorySkillRelationshipResult.records;
                    let mSelectedSkillMap: { [id: number]: SkillCategorySkillRelationship } = {};
                    this.$lodash.each(relationships, (relationship: SkillCategorySkillRelationship) => {
                        mSelectedSkillMap[relationship.skillId] = relationship;
                    });

                    return mSelectedSkillMap;
                })
                .catch(() => {
                    return {};
                });
        }

        /*
        * Called when page is changed.
        * */
        public vOnPageChanged(): void {
            // Set loading flag to be true.
            this.bIsLoadingSkills = true;

            // Add loading screen.
            this.addLoadingScreen();

            // Load skill using global search condition.
            this.loadSkills(null)
                .then((loadSkillResult: SearchResult<Skill[]>) => {
                    this.loadSkillResult = loadSkillResult;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                    this.bIsLoadingSkills = false;
                });
        }

        /*
        * Called when cancel button is clicked.
        * */
        public vOnModalCancel(): void {
            this.$emit('cancel');
        }

        /*
        * Called when ok button is clicked.
        * */
        public vOnModalConfirm(): void {

            // Get selected skill map.
            let mSelectedSkillMap = this.mSelectedSkillMap;
            if (!mSelectedSkillMap)
                return null;

            let ids = Object
                .keys(mSelectedSkillMap)
                .filter((key) => mSelectedSkillMap[key])
                .map((id) => parseInt(id));
            this.$emit('select-skill', this.skillCategory.id, ids);
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {
            this.skillCategory = Object.assign({}, this.skillCategoryProperty);

            // Add loading screen.
            this.addLoadingScreen();

            // Mark the flag that skills are being fetched.
            this.bIsLoadingSkills = true;

            let pLoadSkillPromise = this.loadSkills(null);

            let pLoadSelectedSkillMapPromise = this
                .loadSelectedSkills(this.skillCategory.id);

            Promise.all([pLoadSkillPromise, pLoadSelectedSkillMapPromise])
                .then((loadedResults: Array<any>) => {
                    this.loadSkillResult = <SearchResult<Array<Skill>>> loadedResults[0];
                    this.mSelectedSkillMap = loadedResults[1];
                })
                .finally(() => {
                    this.bIsLoadingSkills = false;
                    this.deleteLoadingScreen();
                })
        }

        //#endregion
    }
</script>

<style scoped>

</style>