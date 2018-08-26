<template>
    <div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <span v-if="skillCategory && skillCategory.id">Edit {{skillCategory.name}}</span>
                    <span v-else>Add skill category</span>
                </h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-lg-3">
                        <label>Name</label>
                    </div>
                    <div class="col-lg-9">
                        <div class="form-group">
                            <input type="text"
                                   class="form-control"
                                   v-model="skillCategory.name">
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <div class="text-center">
                    <button class="btn btn-primary"
                            @click="vOnOkClicked()">OK
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="vOnCancelClicked()">Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">


    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {SkillCategory} from "../../../models/skill-category";

    @Component({
        name: 'skill-category-detail',
        dependencies: ['$lodash']
    })
    export default class SkillCategoryDetailComponent extends Vue {

        //#region Properties

        // Skill category input property.
        @Prop(Object)
        private skillCategoryProperty: SkillCategory;

        // Skill category for information binding.
        private skillCategory: SkillCategory;

        //#endregion

        //#region Constructor

        //#endregion

        //#region Methods

        /*
        * Called when ok button is clicked.
        * */
        public vOnOkClicked(): void {
            this.$emit('click-ok', this.skillCategory);
        }

        /*
        * Called when cancel button is clicked.
        * */
        public vOnCancelClicked(): void {
            this.$emit('click-cancel');
        }

        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted(): void {
            if (this.skillCategoryProperty)
                this.skillCategory = this.$lodash.clone(this.skillCategoryProperty);
            else
                this.skillCategory = new SkillCategory();
        }

        //#endregion
    }
</script>

<style scoped>

</style>