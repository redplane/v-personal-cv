export class Responsibility {

    //#region Properties

    public id: number;

    public name: string;

    public createdTime: number;

    public lastModifiedTime: number | null;

    //#endregion

    //#region Constructors

    public constructor(){
        this.id = 0;
        this.name = '';
        this.createdTime = 0;
        this.lastModifiedTime = null;
    }

    //#endregion
}