<template>
    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title" v-if="!user || !user.id">Add user</h3>
            <h3 class="panel-title" v-if="user && user.id">Edit user</h3>
        </div>
        <div class="panel-body"
             v-if="user">
            <!--First name-->
            <div class="row">
                <div class="col-lg-3">
                    <label>First name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.firstName"/>
                    </div>
                </div>
            </div>

            <!--Last name-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Last name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.lastName"/>
                    </div>
                </div>
            </div>

            <!--Birthday-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Birthday</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.birthday"/>
                    </div>
                </div>
            </div>

            <!--Role-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Role</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="user.role"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-footer">
            <div class="text-center">
                <button class="btn btn-primary"
                        v-on:click="vOnClickOk()">OK
                </button>
                <span>&nbsp;</span>
                <button class="btn btn-default"
                        v-on:click="vOnClickCancel()">Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component, Prop} from 'vue-property-decorator';
    import {User} from "../../../models/user";

    @Component
    export default class UserDetailComponent extends Vue{

        //#region Properties

        @Prop(Object)
        private userProperty: User;

        /*
        * User information.
        * */
        private user: User;

        //#endregion

        //#region Constructor

        /*
        * Initialize component with settings.
        * */
        public constructor(){
            super();
            this.user = new User();
        }

        //#endregion

        //#region Methods

        /*
        * Called when
        * */
        public mounted(){
            this.user = Object.assign({}, this.userProperty);
        }

        //#endregion

        //#region Events

        /*
        * Event which is fired when OK button is clicked.
        * */
        public vOnClickOk(): void {
            let user: User = Object.assign({}, this.user);
            this.$emit('confirm', user);
        }

        /*
        * Event which is fired when cancel button is clicked.
        * */
        public vOnClickCancel(): void {
            this.$emit('cancel');
        }

        //#endregion
    }
</script>

<style scoped>

</style>