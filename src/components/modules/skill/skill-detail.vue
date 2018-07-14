<template>
    <div>
        <h3 v-if="!skill.id">Add skill</h3>
        <h3 v-if="skill.id">Edit skill</h3>
        <hr/>
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
            <div class="row">
                <div class="col-lg-3">
                    <label>Created time</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"
                               v-model="skill.createdTime"/>
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
            skillProperty: {},
            visibilityProperty: false
        },
        data() {
            return {
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
                    // Object.assign(self.skill, {});
                    else
                    // Object.assign(self.skill, skill);
                        self.skill = Vue.util.extend({}, skill);
                });

            this.visibility = this.visibilityProperty;
        },
        methods: {
            vOnClickOk() {
                this.$emit('confirm', {skill: this.skill});
            },
            vOnClickCancel() {
                this.$emit('cancel');
            }
        },
        watch: {
            visibilityProperty(val) {
                this.visibility = val;
            }
        }
    }
</script>

<style scoped>

</style>