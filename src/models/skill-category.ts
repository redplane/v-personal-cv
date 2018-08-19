export class SkillCategory {

    //#region Properties

    /*
    * Index of skill category.
    * */
    public id: number;

    /*
    * User index of skill category.
    * */
    public userId: number;

    /*
    * Skill category photo.
    * */
    public photo: string;

    /*
    * Skill category name.
    * */
    public name: string;

    /*
    * Skill category created time.
    * */
    public createdTime: number;

    //#endregion

    //#region Constructor

    /*
    * Initialize model with settings.
    * */
    public constructor(){
        this.id = 0;
        this.userId = 0;
        this.photo = '';
        this.name = '';
        this.createdTime = 0;
    }

    //#endregion
}