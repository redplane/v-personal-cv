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
                        <!--<textarea class="form-control"-->
                        <!--v-model="userHobby.description"-->
                        <!--rows="3"></textarea>-->
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

<script>

    import Trumbowyg from 'vue-trumbowyg/dist/vue-trumbowyg';

    export default {
        name: 'user-hobby-detail',
        dependencies: [],
        props: {
            userHobbyDetailProperty: null
        },
        components: {
            Trumbowyg
        },
        data() {
            return {
                userHobby: null,

                editorConfig: {
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
                }
            }
        },
        methods: {
            //#region Methods

            /*
            * Called when OK button is clicked.
            * */
            vOnOkClicked() {
                this.$emit('ok', this.userHobby);
            },

            /*
            * Called when cancel button is clicked.
            * */
            vOnCancelClicked() {
                this.$emit('cancel', this.userHobby);
            }

            //#endregion
        },
        mounted() {
            let self = this;
            let loadUserDetailPromise = new Promise(resolve => {
                resolve(self.userHobbyDetailProperty);
            });

            loadUserDetailPromise
                .then((loadUserHobbyDetailResult) => {
                    if (!loadUserHobbyDetailResult)
                        loadUserHobbyDetailResult = {};
                    self.userHobby = Object.assign({}, loadUserHobbyDetailResult);
                })
                .catch(() => {
                    self.userHobby = {};
                });
        }
    }
</script>

<style scoped>

</style>