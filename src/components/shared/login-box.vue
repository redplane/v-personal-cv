<template>
    <div>
        <form @submit="vOnSubmitForm($event)"
              v-if="loginModel"
              novalidate>
            <div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title"><b class="fa fa-camera"></b> Login</h3>
                </div>
                <div class="panel-body">
                    <!--Email-->
                    <div class="row">
                        <div class="col-lg-12">
                            <label>Email</label>
                            <div class="form-group">
                                <input class="form-control"
                                       v-model="loginModel.email">
                            </div>
                        </div>
                    </div>

                    <!--Password-->
                    <div class="row">
                        <div class="col-lg-12">
                            <label>Password</label>
                            <div class="form-group">
                                <input class="form-control"
                                       v-model="loginModel.password"
                                       type="password">
                            </div>
                        </div>
                    </div>

                    <!--Google recaptcha-->
                    <div class="row">
                        <div class="col-lg-12">
                            <vue-recaptcha :sitekey="captchaSiteKey"
                                           @verify="vOnGoogleCaptchaVerify"></vue-recaptcha>
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="text-center">
                        <button class="btn btn-primary">
                            Login
                        </button>
                        <span>&nbsp;</span>
                        <button class="btn btn-default"
                                type="button"
                                @click="vOnCancelClick()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">

    import {VueRecaptcha} from 'vue-recaptcha';
    import {Vue, Component} from 'vue-property-decorator'
    import {LoginViewModel} from "../../view-model/user/login.view-model";

    @Component({
        dependencies: ['gCaptchaSiteKey'],
        components:{
            VueRecaptcha
        }
    })
    export default class LoginBoxComponent extends Vue{

        //#region Properties

        /*
        * Login model.
        * */
        private loginModel: LoginViewModel;

        public get captchaSiteKey(): string{
            return this.gCaptchaSiteKey;
        }

        //#endregion

        //#region Constructor

        public constructor(){
            super();
            this.loginModel = new LoginViewModel();
        }
        //#endregion

        //#region Methods

        /*
        * Called when form is submitted.
        * */
        public vOnSubmitForm($event: any): void{
            // Prevent form default behaviour.
            if ($event)
                $event.preventDefault();

            // Copy view model.
            let loginModel: LoginViewModel = Object.assign({}, this.loginModel);
            this.$emit('click-login', loginModel);
        }

        /*
        * Called when cancel button is clicked.
        * */
        public vOnCancelClick(): void{
            this.$emit('click-cancel');
        }

        /*
        * Called when captcha is verified.
        * */
        public vOnGoogleCaptchaVerify(response: string){
            this.loginModel.clientCaptchaCode = response;
        }

        //#endregion
    }
</script>

<style scoped>

</style>