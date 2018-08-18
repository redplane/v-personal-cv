import {Project} from "@/models/project";
import {Skill} from "@/models/skill";
import {Responsibility} from "@/models/responsibility";

export class ProjectViewModel extends Project {

    //#region Properties

    /*
    * Responsibilities list.
    * */
    public responsibilities: Responsibility[] | null;

    /*
    * Skills list.
    * */
    public skills: Skill[] | null;

    //#endregion

}