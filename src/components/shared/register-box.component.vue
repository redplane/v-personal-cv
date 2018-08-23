<template>
    <div>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">Register account</h3>
            </div>
            <div class="panel-body">

                <!--Email-->
                <div class="row">
                    <div class="col-sm-3">Email</div>
                    <div class="form-group">
                        <input class="form-control" v-model="model.email"/>
                    </div>
                </div>

                <!--First name-->
                <div class="row">
                    <div class="col-sm-3">First name</div>
                    <div class="form-group">
                        <input class="form-control" v-model="model.firstName"/>
                    </div>
                </div>

                <!--Last name-->
                <div class="row">
                    <div class="col-sm-3">Last name</div>
                    <div class="form-group">
                        <input class="form-control" v-model="model.lastName"/>
                    </div>
                </div>

                <!--Password-->
                <div class="row">
                    <div class="col-sm-3">Password</div>
                    <div class="form-group">
                        <input class="form-control" type="password" v-model="model.password"/>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <div class="text-center">
                    <button class="btn btn-primary">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {RegisterViewModel} from "../../view-model/user/register.view-model";
    @Component({
        name: 'register-box'
    })
    export default class RegisterBoxComponent extends Vue {

        //#region Properties

        // Model for information binding.
        private model: RegisterViewModel;

        //#endregion

        //#region Methods

        //#endregion

        //#region Constructor

        public constructor(){
            super();
            this.model = new RegisterViewModel();
        }
        //#endregion
    }

</script>

<style scoped>

</style>