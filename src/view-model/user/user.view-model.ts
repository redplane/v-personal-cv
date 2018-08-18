import {User} from "@/models/user";
import {UserDescription} from "@/models/user-description";

export class UserViewModel extends User {

    //#region Properties

    /*
    * User descriptions.
    * */
    public descriptions: UserDescription[] | null;

    //#endregion

}