import {Pagination} from "@/models/pagination";

export class LoadSkillCategorySkillRelationshipViewModel {

    //#region Properties

    /*
    * Skill category indexes.
    * */
    public skillCategoryIds: Array<number> | null;

    /*
    * Skill indexes.
    * */
    public skillIds: Array<number> | null;

    /*
    * Pagination information.
    * */
    public pagination: Pagination;

    //#endregion

    //#region Methods

    /*
    * Initialize view model with injectors.
    * */
    public constructor(){
        this.skillCategoryIds = null;
        this.skillIds = null;
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.records = 1;
    }

    //#endregion
}