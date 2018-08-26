<template>
    <div class="panel panel-info">
        <div class="panel panel-heading">
            <h3 class="panel-title" v-if="!responsibility.id">Add responsibility</h3>
            <h3 class="panel-title" v-if="responsibility.id">Edit responsibility</h3>
        </div>
        <div v-if="responsibility" class="panel panel-body">
            <!--Name-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="responsibility.name"/>
                    </div>
                </div>
            </div>

            <!--Created time-->
            <div class="row"
                 v-if="responsibility && responsibility.id">
                <div class="col-lg-3">
                    <label>Created time</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="responsibility.createdTime"
                               v-bind:readonly="bIsInEditMode"/>
                    </div>
                </div>
            </div>

            <!--Last modified time-->
            <div class="row"
                 v-if="responsibility && responsibility.id">
                <div class="col-lg-3">
                    <label>Last modified time</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="responsibility.lastModifiedTime"
                               v-bind:readonly="bIsInEditMode"/>
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

    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {Responsibility} from "../../../models/responsibility";
    @Component({
        name: 'responsibility-detail',
        dependencies: ['$lodash']
    })
    export default class ResponsibilityDetailComponent extends Vue {

        //#region Properties

        // Responsibility to display its information onto component.
        private responsibility: Responsibility;

        // Responsibility input property.
        @Prop(Object)
        private responsibilityProperty: Responsibility;

        // Check whether component is in edit-mode or not.
        public get bIsInEditMode(): boolean {
            // In create mode.
            if (this.responsibility.id)
                return true;

            return false;
        }

        //#endregion

        //#region Constructor

        /*
        * Initialize component with settings.
        * */
        public constructor(){
            super();
            this.responsibility = new Responsibility();
        }

        //#endregion

        //#region Methods

        /*
        * Called when ok button is clicked.
        * */
        public vOnClickOk(): void {
            let responsibility: Responsibility = this.$lodash.clone(this.responsibility);
            this.$emit('confirm', responsibility);
        }

        /*
        * Called when cancel is clicked.
        * */
        public vOnClickCancel(): void {
            this.$emit('cancel');
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {

            if (this.responsibilityProperty)
                this.responsibility = this.$lodash.clone(this.responsibilityProperty);
            else
                this.responsibility = new Responsibility();
        }

        //#endregion

    }
</script>

<style scoped>

</style>