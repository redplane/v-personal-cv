export class SearchResult<T>{

    //#region Properties

    /*
    * List of records returned from api.
    * */
    records: T;

    /*
    * Total number of records that match with the search condition.
    * */
    total: number;

    /*
    * Get total page.
    * */
    public totalPage(itemsPerPage: number): number {

        if (!this.total || !itemsPerPage)
            return 1;

        if (this.total < 1 || itemsPerPage < 1)
            return 1;

        let iPage = this.total / itemsPerPage;
        if (iPage < 1)
            return 1;

        iPage = Math.floor(iPage);
        let bHasMoreRecords = (this.total - (itemsPerPage * iPage)) > 0;
        if (bHasMoreRecords)
            iPage++;

        return iPage;

    }
    //#endregion
}