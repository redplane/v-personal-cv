import {Pagination} from "@/models/pagination";

export class SkillCategorySkillRelationship {

    //#region Properties

    /*
    * List of skill indexes.
    * */
    public skillId: number;

    /*
    * List of skill categories.
    * */
    public skillCategoryId: number;

    /*
    * Point
    * */
    public point: number;

    //#endregion

    //#region Constructor

    /*
    * Initialize view model with injectors.
    * */
    public constructor(){
        this.skillId = 0;
        this.skillCategoryId = 0;
        this.point = 0;
    }

    //#endregion
}