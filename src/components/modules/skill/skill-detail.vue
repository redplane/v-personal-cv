<template>
    <div>
        <div class="panel panel-info">
            <h3 class="panel-title">
                <span v-if="!skill.id">Add skill</span>
                <span v-if="skill.id">Edit skill</span>
            </h3>
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
                                   v-model="skill.name"
                                   :readonly="bIsReadOnly"/>
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
                                   v-model="skill.createdTime"
                                   v-bind:readonly="bIsReadOnly"/>
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

<script>
    import Vue from 'vue';

    export default {
        name: 'skill-detail',
        props: {
            readonlyProperty: false,
            skillProperty: {}
        },
        data() {
            return {
                bIsReadOnly: this.readonlyProperty,
                skill: this.skillProperty,
                visibility: false
            }
        },
        mounted() {

            let self = this;
            let pGetSkillDetailPromise = new Promise(resolve => {
                resolve(self.skillProperty);
            });

            pGetSkillDetailPromise
                .then((skill) => {
                    if (!skill)
                        self.skill = Vue.util.extend({}, {});
                    else
                        self.skill = Vue.util.extend({}, skill);
                });

            this.visibility = this.visibilityProperty;
        },
        methods: {
            vOnClickOk() {
                let skill = Vue.util.extend({}, this.skill);
                this.$emit('confirm', skill);
            },
            vOnClickCancel() {
                this.$emit('cancel');
            }
        }
    }
</script>

<style scoped>

</style>