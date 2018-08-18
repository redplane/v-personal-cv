export class SearchResult<T>{

    //#region Properties

    /*
    * List of records returned from api.
    * */
    records: T;

    /*
    * Total number of records that match with the search condition.
    * */
    total: number

    //#endregion
}