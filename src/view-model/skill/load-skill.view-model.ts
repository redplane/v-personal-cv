import {Pagination} from "@/models/pagination";

export class LoadSkillViewModel {

    //#region Properties

    /*
    * Indexes of skill.
    * */
    public ids: Array<number> | null;

    /*
    * Name of skill.
    * */
    public names: Array<string> | null;

    /*
    * Pagination information.
    * */
    public pagination: Pagination;

    //#endregion

    //#region Constructor

    /*
    * Initialize view model with settings.
    * */
    public constructor(){
        this.ids = null;
        this.names = null;
        this.pagination = new Pagination();
        this.pagination.records = 1;
        this.pagination.page = 1;
    }

    //#endregion

}