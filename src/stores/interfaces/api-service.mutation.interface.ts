export interface IApiServiceMutation {

    //#region Methods

    /*
    * Load user from api service.
    * */
    loadUsers(): Promise<any>;

    //#endregion
}