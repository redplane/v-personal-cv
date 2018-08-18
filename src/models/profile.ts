import {UserRoles} from "@/enumerations/user-role.enum";

export class Profile {

    //#region Properties

    public id: number = 0;

    public email: string = '';

    public firstName: string = '';

    public lastName: string = '';

    public photo: string = '';

    public birthday: number = 0;

    public role: UserRoles = UserRoles.admin;

    //#endregion
}