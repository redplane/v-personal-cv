import {SkillCategory} from "@/models/skill-category";
import {SkillInfoViewModel} from "@/view-model/skill/skill-info.view-model";

export class SkillCategoryViewModel extends SkillCategory {

    //#region Properties

    public skills: SkillInfoViewModel[] | null;

    //#endregion

    //#region Constructor

    public constructor() {
        super();
        this.skills = null;
    }

    //#endregion

}