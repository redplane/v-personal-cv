<template>
    <div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <span v-if="!userDescription || !userDescription.id">Add user description</span>
                    <span v-if="userDescription && userDescription.id">Edit user description</span>
                </h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-lg-12">
                        <label>Description</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="form-group">
                            <textarea v-model="userDescription.description"
                                      class="form-control"
                                      rows="5"
                                      style="resize: none"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <div class="text-center">
                    <button class="btn btn-primary" @click="vOnOkClick()">OK</button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default" v-on:click="vOnCancelClick()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {UserDescription} from "../../../models/user-description";


    @Component
    export default class ProfileDescriptionDetailComponent extends Vue {

        //#region Properties

        /*
        * User description detail property.
        * */
        @Prop(Object)
        private userDescriptionProperty: UserDescription;

        /*
        * User description information.
        * */
        private userDescription: UserDescription | null;

        //#endregion

        //#region Methods

        /*
        * Called when ok is clicked.
        * */
        public vOnOkClick(): void {
            this.$emit('click-confirm', this.userDescription);
        }

        /*
        * Called when cancel is clicked.
        * */
        public vOnCancelClick(): void {
            this.$emit('click-cancel');
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void{
            // Get method context.
            this.userDescription = Object.assign({}, this.userDescriptionProperty);
        }

        //#endregion

    }
</script>

<style scoped>

</style>