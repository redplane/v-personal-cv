<template>
    <div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <span v-if="skill && skill.id">Edit skill</span>
                    <span v-else>Add skill</span>
                </h3>
            </div>
        </div>
        <div class="panel-body">
            <div v-if="skill">
                <!--Name-->
                <div class="row">
                    <div class="col-lg-3">
                        <label>Name</label>
                    </div>
                    <div class="col-lg-9">
                        <div class="form-group">
                            <input class="form-control"
                                   v-model="skill.name"/>
                        </div>
                    </div>
                </div>

                <!--Created time-->
                <div class="row"
                     v-if="skill && skill.id">
                    <div class="col-lg-3">
                        <label>Created time</label>
                    </div>
                    <div class="col-lg-9">
                        <div class="form-group">
                            <input class="form-control"
                                   :disabled="true"
                                   v-model="skill.createdTime"/>
                        </div>
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
    import {Skill} from "../../../models/skill";

    @Component({
        name: 'skill-detail',
        dependencies: ['$lodash']
    })
    export default class SkillDetailComponent extends Vue {

        //#region Properties

        // Skill category input property.
        @Prop(Object)
        private skillProperty: Skill;


        // Skill information.
        private skill: Skill;

        //#endregion

        //#region Constructor

        public constructor(){
            super();
            this.skill = new Skill();
        }

        //#endregion

        //#region Methods

        /*
        * Called when ok button is clicked.
        * */
        public vOnClickOk(): void {
            let skill: Skill = this.$lodash.clone(this.skill);
            this.$emit('confirm', skill);
        }

        /*
        * Called when cancel button is clicked.
        * */
        public vOnClickCancel(): void {
            this.$emit('cancel');
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted.
        * */
        public mounted(): void{
            if (this.skillProperty) {
                this.skill = this.$lodash.clone(this.skillProperty);
                return;
            }

            this.skill = new Skill();
        }

        //#endregion
    }
</script>

<style scoped>

</style>