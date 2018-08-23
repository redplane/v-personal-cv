import {Range} from "@/models/range";
import {Pagination} from "@/models/pagination";

export class LoadSkillCategoryViewModel {

    //#region Properties

    /*
    * List of ids of skill category.
    * */
    public ids: Array<number> | null;

    /*
    * List of user ids.
    * */
    public userIds: Array<number> | null;

    /*
    * List of names that are used for searching.
    * */
    public names: Array<string> | null;

    /*
    * Time when skill category is created.
    * */
    public createdTime: Range<number | null, number | null> | null;

    /*
    * Whether related skills are included in search result or not.
    * */
    public includeSkills: boolean;

    /*
    * Pagination information
    * */
    public pagination: Pagination;

    //#endregion

    //#region Constructor

    public constructor(){
        this.ids = null;
        this.userIds = null;
        this.names = null;
        this.createdTime = null;
        let pagination = new Pagination();
        pagination.page = 1;
        pagination.records = 1;
        this.pagination = new Pagination();

    }

    //#endregion

}