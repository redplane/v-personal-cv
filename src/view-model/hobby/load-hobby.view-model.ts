import {Pagination} from "@/models/pagination";

export class LoadHobbyViewModel {

    //#region Properties

    /*
    * List of user ids.
    * */
    public userIds: Array<number> | null = null;

    /*
    * Pagination information.
    * */
    public pagination: Pagination | null;

    //#endregion

    //#region Constructors

    public constructor(){
        this.pagination = new Pagination();
    }

    //#endregion
}