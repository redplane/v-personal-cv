export class EditUserViewModel {

    //#region Properties
    
    public id: number;

    /*
    * User first name.
    * */
    public firstName: string;

    /*
    * User last name.
    * */
    public lastName: string;

    /*
    * User birthday.
    * */
    public birthday: number | null;

    /*
    * User binary photo.
    * */
    public photo: Blob | null;

    //#endregion
}