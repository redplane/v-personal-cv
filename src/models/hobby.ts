export class Hobby {

    //#region Properties

    /*
    * Id of hobby.
    * */
    public id: number | null;

    /*
    * User index.
    * */
    public userId: number | null;

    /*
    * Hobby name.
    * */
    public name: string | null;

    /*
    * Hobby description
    * */
    public description: string | null;

    //#endregion

    //#region Constructor

    /*
    * Initialize model with default settings.
    * */
    public constructor(){
        this.id = 0;
        this.userId = 0;
        this.name = null;
        this.description = null;
    }

    //#endregion
}