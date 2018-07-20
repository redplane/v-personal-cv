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

<script>
    import Vue from 'vue';

    export default {
        name: 'responsibility-detail',
        props: {
            readonlyProperty: false,
            responsibilityProperty: {}
        },
        computed: {
            /*
            * Check whether component is in edit-mode or not.
            * */
            bIsInEditMode(){
                // In create mode.
                if (this.responsibility.id)
                    return true;

                return false;
            }
        },
        data() {
            return {
                responsibility: {},
                visibility: false
            }
        },
        mounted() {

            let self = this;
            let pGetResponsibilityPromise = new Promise(resolve => {
                resolve(self.responsibilityProperty);
            });

            pGetResponsibilityPromise
                .then((responsibility) => {
                    if (!responsibility)
                        self.responsibility = {};
                    else
                        self.responsibility = Vue.util.extend({}, responsibility);
                });

            this.visibility = this.visibilityProperty;
        },
        methods: {
            vOnClickOk() {
                let responsibility = Vue.util.extend({}, this.responsibility);
                this.$emit('confirm', responsibility);
            },
            vOnClickCancel() {
                this.$emit('cancel');
            }
        },
        watch: {
            readonlyProperty(value) {
                this.readonlyProperty = value;
            }
        }
    }
</script>

<style scoped>

</style>