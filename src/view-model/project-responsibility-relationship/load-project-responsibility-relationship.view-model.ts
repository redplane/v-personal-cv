import {Range} from "@/models/range";
import {Pagination} from "@/models/pagination";

export class LoadProjectResponsibilityRelationshipViewModel {

    //#region Properties

    public projectIds: number[] | null = null;

    public responsibilityIds: number[] | null = null;

    public createdTime: Range<number|null, number|null> | null = null;

    public pagination: Pagination | null = null;
    
    //#endregion

}