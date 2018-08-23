export class RegisterViewModel {
    //#region Properties

    // Email address.
    public email: string;

    // First name.
    public firstName: string;

    // Last name.
    public lastName: string;

    // Password.
    public password: string;

    // Captcha code provided by re-captcha service.
    public clientCaptchaCode: string;

    //#endregion

    //#region Constructor

    public constructor(){
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.password = '';
        this.clientCaptchaCode = '';
    }

    //#endregion
}