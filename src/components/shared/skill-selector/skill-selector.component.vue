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
                            <th>Point</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="bIsLoadingSkills">
                            <td colspan="4" class="text-center">Data is being fetched ....</td>
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
                            <td>
                                <input type="number"
                                       class="form-control"
                                       v-model="mSelectedSkillPoint[skill.id]">
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
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Action, Mutation} from "vuex-class";
    import {SkillCategory} from "../../../models/skill-category";
    import {LoadSkillViewModel} from "../../../view-model/skill/load-skill.view-model";
    import {SkillCategorySkillRelationship} from "../../../models/skill-category-skill-relationship";
    import {Skill} from "../../../models/skill";
    import {SearchResult} from "../../../models/search-result";
    import {Pagination} from "../../../models/pagination";
    import {LoadSkillCategorySkillRelationshipViewModel} from "../../../view-model/skill/load-skill-category-skill-relationship.view-model";
    import {HasSkillViewModel} from "../../../view-model/has-skill.view-model";
    import {ProjectSkillRelationship} from "../../../models/project-skill-relationship";
    import {PaginationConstant} from "../../../constants/pagination.constant";

    @Component({
        name: 'skill-selector'
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
        private mSelectedSkillMap: { [id: string]: SkillCategorySkillRelationship; } = {};

        /*
        * Map of skill & point.
        * */
        private mSelectedSkillPoint: { [id: number]: number } = {};

        /*
        * Calculate total skill page to display.
        * */
        public get totalSkillPage(): number {

            // Get skill result.
            let loadSkillResult: SearchResult<Skill[]> = this.loadSkillResult;
            if (!loadSkillResult)
                return 1;

            let loadSkillCondition: LoadSkillViewModel = this.loadSkillCondition;
            if (!loadSkillCondition || !loadSkillCondition.pagination || !loadSkillCondition.pagination.records)
                return 1;

            return loadSkillResult.totalPage(this.loadSkillCondition.pagination.records);
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

            let pagination = new Pagination();
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
        @Mutation('addLoadingScreen', {namespace: 'app'})
        public addLoadingScreen: () => void;

        /*
        * Delete loading screen from UI.
        * */
        @Mutation('deleteLoadingScreen', {namespace: 'app'})
        public deleteLoadingScreen: () => void;


        @Action('loadSkills', {namespace: 'apiSkill'})
        private loadSkillsAsync: (condition: LoadSkillViewModel) => Promise<SearchResult<Skill[]>>;

        @Action('loadSkillCategorySkillRelationships', {namespace: 'apiSkill'})
        private loadSkillCategorySkillRelationshipsAsync: (condition: LoadSkillCategorySkillRelationshipViewModel) => Promise<SearchResult<ProjectSkillRelationship[]>>;

        /*
        * Load skill by using specific condition.
        * */
        public loadSkills(loadSkillCondition: LoadSkillViewModel | null): Promise<SearchResult<Skill[]>> {
            let condition = loadSkillCondition;
            if (!condition)
                condition = this.loadSkillCondition;

            return this
                .loadSkillsAsync(condition)
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
            let loadSkillCategorySkillRelationshipCondition = new LoadSkillCategorySkillRelationshipViewModel();
            loadSkillCategorySkillRelationshipCondition.skillCategoryIds = [skillCategoryId];

            // Clear the selected list.
            this.mSelectedSkillMap = {};

            return this
                .loadSkillCategorySkillRelationshipsAsync(loadSkillCategorySkillRelationshipCondition)
                .then((loadSkillCategorySkillRelationshipResult: SearchResult<SkillCategorySkillRelationship[]>) => {
                    // Get relationships.
                    let relationships = loadSkillCategorySkillRelationshipResult.records;
                    let mSelectedSkillMap: { [id: number]: SkillCategorySkillRelationship } = {};

                    for (let relationship of relationships) {
                        mSelectedSkillMap[relationship.skillId] = relationship;
                    }

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
                    let skills = loadSkillResult.records;
                    if (skills)
                        this.addSkillPointToMap(skills);
                })
                .catch(() => {})
                .then(() => {
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
                return;

            // List of skills.

            let hasSkills: Array<HasSkillViewModel> = Object
                .keys(mSelectedSkillMap)
                .filter((key: string) => mSelectedSkillMap[key])
                .map((id: string) => {
                    let iId = parseInt(id);
                    let hasSkill = new HasSkillViewModel();
                    hasSkill.skillId = iId;
                    hasSkill.skillCategoryId = this.skillCategory.id;
                    hasSkill.point = this.mSelectedSkillPoint[iId];

                    return hasSkill;
                });


            this.$emit('select-skill', this.skillCategory.id, hasSkills);
        }

        /*
        * Add skill point to map.
        * */
        private addSkillPointToMap(skills: Skill[]): void {

            // Selected skill - point map.
            let mSelectedSkillPoint: { [id: number]: number } = {};

            for (let skill of skills) {
                mSelectedSkillPoint[skill.id] = 0;
                let skillCategory = this.mSelectedSkillMap[skill.id];
                if (!skillCategory)
                    continue;

                mSelectedSkillPoint[skill.id] = skillCategory.point;
            }

            this.mSelectedSkillPoint = mSelectedSkillPoint;
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

            // Load skills.
            let pLoadSkillPromise = this.loadSkills(null);

            // Load skill map.
            let pLoadSelectedSkillMapPromise = this
                .loadSelectedSkills(this.skillCategory.id);

            let promises: any[] = [pLoadSkillPromise, pLoadSelectedSkillMapPromise];
            Promise.all(promises)
                .then((loadedResults: Array<any>) => {
                    this.loadSkillResult = <SearchResult<Skill[]>> loadedResults[0];
                    this.mSelectedSkillMap = loadedResults[1];

                    let loadedSkills = this.loadSkillResult.records;
                    if (loadedSkills)
                        this.addSkillPointToMap(loadedSkills);
                })
                .catch(() => {
                })
                .then(() => {
                    this.bIsLoadingSkills = false;
                    this.deleteLoadingScreen();
                })
        }

        //#endregion
    }
</script>

<style scoped>

</style>