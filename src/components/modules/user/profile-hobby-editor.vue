<template>
    <div class="panel panel-info"
         v-if="userHobby">
        <div class="panel-heading">
            <h3 class="panel-title">
                <span v-if="!userHobby || !userHobby.id">Add user hobby</span>
                <span v-else>Edit user hobby</span>
            </h3>
        </div>
        <div class="panel-body">
            <!--Hobby name-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="userHobby.name">
                    </div>
                </div>
            </div>

            <!--Hobby description-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Description</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <trumbowyg v-model="userHobby.description" :config="editorConfig"></trumbowyg>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-footer">
            <div class="text-center">
                <button class="btn btn-primary"
                        @click="vOnOkClicked">
                    <span>OK</span>
                </button>
                <span>&nbsp;</span>
                <button class="btn btn-default"
                        @click="vOnCancelClicked">
                    <span>Cancel</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Trumbowyg from 'vue-trumbowyg/src/component.vue';
    import {Hobby} from "../../../models/hobby";
    import {Prop} from "vue-property-decorator";
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components:{
            Trumbowyg
        }
    })
    export default class ProfileHobbyDetailComponent extends Vue {

        //#region Properties

        /*
        * User hobby detail property.
        * */
        @Prop(Object)
        public userHobbyDetailProperty: Hobby;

        /*
        * Hobby information.
        * */
        private userHobby: Hobby | null = null;

        /*
        * Trumbowyg edit configuration.
        * */
        private editorConfig: any = {
            btns: [
                ['viewHTML'],
                ['undo', 'redo'], // Only supported in Blink browsers
                ['formatting'],
                ['strong', 'em', 'del'],
                ['superscript', 'subscript'],
                ['link'],
                ['insertImage'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                ['unorderedList', 'orderedList'],
                ['horizontalRule'],
                ['removeformat'],
            ]
        };

        //#endregion

        //#region Methods

        /*
        * Called when OK button is clicked.
        * */
        public vOnOkClicked(): void {
            this.$emit('ok', this.userHobby);
        }

        /*
        * Called when cancel button is clicked.
        * */
        public vOnCancelClicked(): void {
            this.$emit('cancel', this.userHobby);
        }

        //#endregion

        //#region Events

        public mounted(): void {
            this.userHobby = Object.assign({}, this.userHobbyDetailProperty);
        }

        //#endregion
    }
</script>

<style scoped>

</style>