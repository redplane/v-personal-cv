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

<script>
    export default {
        name: 'user-description-detail',
        props: {
            userDescriptionProperty: {}
        },
        data() {
            return {
                userDescription: {
                    id: 0,
                    userId: 0,
                    description: null
                }
            }
        },
        mounted() {

            // Get method context.
            let self = this;
            let pGetUserDescriptionPromise = new Promise(resolve => {
                resolve(self.userDescriptionProperty);
            });

            pGetUserDescriptionPromise
                .then((userDescription) => {
                    self.userDescription = Object.assign({}, userDescription);
                });
        },
        methods:{

            /*
            * Called when ok is clicked.
            * */
            vOnOkClick(){
                this.$emit('click-confirm', this.userDescription);
            },

            /*
            * Called when cancel is clicked.
            * */
            vOnCancelClick(){
                this.$emit('click-cancel');
            }
        }
    }
</script>

<style scoped>

</style>