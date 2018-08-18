export class Pagination{
    //#region Properties

    /*
    * Page index.
    * */
    public page: number;

    /*
    * Records number per page.
    * */
    public records: number;

    //#endregion

    //#region Constructor

    /*
    * Initialize model with page.
    * */
    public constructor(){
        this.page = 1;
        this.records = 10;
    }

    //#endregion
}