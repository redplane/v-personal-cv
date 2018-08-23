import {Skill} from "@/models/skill";

export class SkillViewModel extends Skill {

    //#region Properties

    public point: number;

    //#endregion

    //#region Constructor

    public constructor(){
        super();
        this.point = 0;
    }

    //#endregion

}