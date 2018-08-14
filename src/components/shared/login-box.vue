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

<script>

    import vueRecaptcha from 'vue-recaptcha';

    export default {
        name: 'login-box',
        dependencies: ['gCaptchaSiteKey'],
        data(){
            return {
                /*
                * Model for exchanging access token.
                * */
                loginModel: {
                    email: '',
                    password: '',
                    clientCaptchaCode: ''
                }
            }
        },
        methods:{

            /*
            * Called when form is submitted.
            * */
            vOnSubmitForm($event){
                // Prevent form default behaviour.
                if ($event)
                    $event.preventDefault();

                let self = this;
                self.$emit('click-login', self.loginModel);
            },

            /*
            * Called when cancel button is clicked.
            * */
            vOnCancelClick(){
                let self = this;
                self.$emit('click-cancel');
            },

            /*
            * Called when captcha is verified.
            * */
            vOnGoogleCaptchaVerify(response){
                let self = this;
                self.loginModel.clientCaptchaCode = response;
            }

        },
        components:{
            vueRecaptcha
        },
        computed:{
            captchaSiteKey(){
                return this.gCaptchaSiteKey;
            }
        }
    }
</script>

<style scoped>

</style>