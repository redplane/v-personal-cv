import {Pagination} from "@/models/pagination";

export class LoadUserViewModel {

    //#region Properties

    // Pagination information.
    public pagination: Pagination;

    //#endregion

    //#region Constructor

    /*
    * Initialize view model with settings.
    * */
    public constructor(){
        let pagination: Pagination = new Pagination();
        pagination.page = 1;
        pagination.records = 1;
    }

    //#endregion

}