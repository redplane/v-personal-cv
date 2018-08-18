export class Project {

    //#region Properties

    public id: number;

    public userId: number;

    public name: string;

    public description: string;

    public startedTime: number;

    public finishedTime: number | null;

    //#endregion

    //#region Constructor

    /*
    * Initialize model with settings.
    * */
    public constructor(){
        this.id = 0;
        this.userId = 0;
        this.name = '';
        this.description = '';
        this.startedTime = 0;
        this.finishedTime = null;
    }

    //#endregion

}