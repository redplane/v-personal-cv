export class LoginViewModel{

    //#region Properties

    // Email address.
    public email: string;

    // Account password.
    public password: string;

    // Client captcha code.
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