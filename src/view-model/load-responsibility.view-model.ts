import {Pagination} from "@/models/pagination";

export class LoadResponsibilityViewModel {

    //#region Properties

    // Pagination information.
    public pagination: Pagination;

    //#endregion

    //#region Constructor

    /*
    * Initialize view model with settings.
    * */
    public constructor(){
        this.pagination = new Pagination();
        this.pagination.page = 1;
        this.pagination.records = 1;
    }

    //#endregion

}