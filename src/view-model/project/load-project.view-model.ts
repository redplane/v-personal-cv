import {Pagination} from "@/models/pagination";

export class LoadProjectViewModel {

    //#region Properties

    /*
    * User indexes.
    * */
    public userIds: Array<number> | null;

    /*
    * Whether responsibilities should be included or not.
    * */
    public includeResponsibilities: boolean;

    /*
    * Whether skills should be included or not.
    * */
    public includeSkills: boolean;

    /*
    * Pagination information.
    * */
    public pagination: Pagination;

    //#endregion

    //#region Constructor

    /*
    * Initialize model with settings.
    * */
    public constructor(){
        this.userIds = null;
        this.includeResponsibilities = false;
        this.includeSkills = false;
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.records = 1;
    }

    //#endregion
}