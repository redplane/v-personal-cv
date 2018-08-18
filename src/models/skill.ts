export class Skill {

    //#region Properties

    /*
    * Id of skill.
    * */
    public id: number;

    /*
    * Name of skill.
    * */
    public name: string;

    /*
    * Skill created time.
    * */
    public createdTime: number;

    //#endregion

    //#region Constructors

    /*
    * Initialize entity with settings.
    * */
    public constructor(){
        this.id = 0;
        this.name = '';
        this.createdTime = 0;
    }

    //#endregion
}