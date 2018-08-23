export class LoginResultViewModel {

    //#region Properties

    // Token to access to system.
    public accessToken: string;

    // Token life time.
    public lifeTime: number;

    // Token type.
    public type: string;

    //#endregion

    //#region Constructor

    public constructor(){
        this.accessToken = '';
        this.lifeTime = 0;
        this.type = '';
    }

    //#endregion

}