import {Pagination} from "@/models/pagination";

export class LoadUserDescriptionViewModel {

    //#region Properties

    public ids: number[] | null = null;

    public userIds: number[] | null = null;

    public pagination: Pagination = new Pagination();

    //#endregion

}