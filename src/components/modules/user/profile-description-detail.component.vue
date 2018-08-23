<template>
    <div>
        <div class="panel panel-info"
             v-if="model">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <span v-if="!model || !model.id">Add user description</span>
                    <span v-if="model && model.id">Edit user description</span>
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
                            <trumbowyg v-model="model.description"
                                       :config="editorConfigs"></trumbowyg>
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
    import Trumbowyg from 'vue-trumbowyg/src/component.vue';

    @Component({
        name: 'profile-description-detail',
        components:{
            Trumbowyg
        }
    })
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
        private model: UserDescription = new UserDescription();

        /*
        * Trumbowyg edit configuration.
        * */
        private editorConfigs: any = {
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
        * Called when ok is clicked.
        * */
        public vOnOkClick(): void {
            this.$emit('click-confirm', this.model);
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
            if (!this.userDescriptionProperty){
                this.model = new UserDescription();
                return;
            }

            // Get method context.
            this.model = Object.assign({}, this.userDescriptionProperty);
        }

        //#endregion

    }
</script>

<style scoped>

</style>