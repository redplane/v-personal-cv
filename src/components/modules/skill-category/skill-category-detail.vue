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
                            @click="vOnOkClicked()">OK</button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="vOnCancelClicked()">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'skill-category-detail',
        props:{
            skillCategoryProperty: null
        },
        data(){
            return {
                skillCategory: {}
            }
        },
        mounted(){

            // Get current context.
            let self = this;

            let pGetSkillCategoryPromise = new Promise(resolve => {
                resolve(self.skillCategoryProperty);
            });

            pGetSkillCategoryPromise.then((skillCategory) => {
                if (!skillCategory){
                    self.skillCategory = {};
                    return;
                }

                self.skillCategory = Object.assign({}, skillCategory);
            })
        },
        methods:{
            /*
            * Called when ok button is clicked.
            * */
            vOnOkClicked(){
                let self = this;
                self.$emit('click-ok', self.skillCategory);
            },
            /*
            * Called when cancel button is clicked.
            * */
            vOnCancelClicked(){
                let self = this;
                self.$emit('click-cancel');
            }
        }
    }
</script>

<style scoped>

</style>