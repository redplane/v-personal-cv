import {Skill} from "@/models/skill";

export class SkillInfoViewModel extends Skill {

    //#region Properties

    // Skill point
    public point: number;

    //#endregion

    //#region Constructor

    /*
    * Initialize view model with default settings.
    * */
    public constructor(){
        super();
        this.point = 0;
    }

    //#endregion

}