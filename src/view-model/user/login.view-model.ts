export class LoginViewModel{

    //#region Properties

    public email: string;

    public password: string;

    public clientCaptchaCode: string;

    //#endregion

    //#region Constructor

    /*
    * Initialize view model with default settings.
    * */
    public constructor(){
        this.email = '';
        this.password = '';
        this.clientCaptchaCode = '';
    }

    //#endregion

}