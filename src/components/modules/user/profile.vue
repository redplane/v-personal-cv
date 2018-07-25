<template>
    <div>
        <!--General information-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading"><h3 class="panel-title">About {{user.firstName}} {{user.lastName}}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="panel-default">
                                    <div class="panel-body text-center">
                                        <img class="img img-thumbnail"
                                             v-bind:src="user.photo"/>
                                    </div>
                                    <div class="panel-footer text-center">
                                        <button class="btn btn-info"
                                                @click="vOnProfileEditClick()">
                                            <span class="fa fa-camera"></span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div class="col-lg-9">
                                <ul v-if="user && user.descriptions">
                                    <li v-for="item in user.descriptions" class="alert alert-info">
                                        {{item.description}}
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)" @click="vOnAddUserDescriptionClick">Add
                                            description</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--Tabs panel-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <ul class="nav nav-tabs nav-justified">
                        <router-link tag="li"
                                     role="presentation"
                                     active-class="active"
                                     :to="{name: 'user-hobbies', param: {userIdProperty: user.id}}">
                            <a href>What I like</a>
                        </router-link>
                        <router-link tag="li"
                                     role="presentation"
                                     active-class="active"
                                     :to="{name: 'user-projects', param: {userIdProperty: user.id}}">
                            <a href>Project I have done</a>
                        </router-link>
                        <router-link tag="li"
                                     role="presentation"
                                     active-class="active"
                                     :to="{name: 'user-skills', param: {userIdProperty: user.id}}">
                            <a href>Technique I have used</a>
                        </router-link>
                    </ul>
                    <!--<tabs v-model="tabIndex"-->
                    <!--@change="vOnTabSelected($event)">-->
                    <!--<tab title="Project I have done"></tab>-->
                    <!--<tab title="Techniques I have used"></tab>-->
                    <!--</tabs>-->
                </div>
            </div>
        </div>

        <!--Projects-->
        <div class="row">
            <router-view :user-id-property="user.id"/>
        </div>

        <!--User profile selector-->
        <modal :header="false"
               :footer="false"
               v-model="bUserProfileEditorVisible"
               v-if="bUserProfileEditorVisible"
               class="replace-body">
            <div slot="default">
                <image-cropper v-on:cancel="vOnImageCropperCancel"
                               v-on:image-cropped="vOnProfileImageCropped"></image-cropper>
            </div>
        </modal>

        <!--Add/edit user description-->
        <modal :header="false"
               :footer="false"
               v-model="bUserDescriptionModalOpened"
               v-if="bUserDescriptionModalOpened"
               class="replace-body">
            <div slot="default">
                <user-description-detail :user-description-property="selectedUserDescription"
                                         v-on:click-confirm="vOnUserDescriptionConfirm($event)"
                                         v-on:click-cancel="vOnUserDescriptionCancel()"/>
            </div>
        </modal>
    </div>
</template>

<script>
    import UserDescriptionDetail from "./user-description-detail";
    import ImageCropper from '../../shared/image-cropper';
    import UserHobby from './user-hobby';

    import {mapMutations, mapGetters} from 'vuex';

    export default {
        name: 'profile',
        components: {ImageCropper, UserHobby, UserDescriptionDetail},
        dependencies: ['userRoleConstant', '$user', '$userDescription', '$hobby', '$skill', '$responsibility', '$project', '$lodash', '$toastr'],
        data() {
            return {
                user: {
                    id: 1,
                    descriptions: [],
                    hobbies: [],
                    projects: [],
                    techniques: []
                },
                bUserDescriptionModalOpened: false,
                selectedUserDescription: null,
                selectedTechnique: null,

                // Whether user profile editor modal is visible or not.
                bUserProfileEditorVisible: false,

                croppedProfilePhoto: {},

                selectedSkillCategory: null,
                tabIndex: 0
            }
        },
        computed: {
            ...mapGetters([
                'profile'
            ])
        },
        mounted() {

            // Get params in route.
            let params = this.$route.params;
            let userId = parseInt(params.id);

            // Get function context.
            let self = this;

            // Block UI.
            self.addLoadingScreen();

            // List of promises that needs resolving.
            let promises = [];

            // Find user information from cache. This is for preventing requesting to api end-point too many times.
            let user = params.user;
            if (user) {
                promises[0] = new Promise((resolve) => {
                    resolve(user);
                });
            } else {

                // Build search condition.
                let condition = {
                    userIds: [self.user.id],
                    pagination: {
                        page: 1,
                        records: 1
                    }
                };

                promises[0] = self.$user
                    .loadUsers(condition)
                    .then((loadUsersResult) => {
                        // Get users.
                        let users = loadUsersResult.records;
                        return users[0];
                    });
            }

            //Load user descriptions
            promises[1] = self.loadUserDescriptions();

            //#endregion

            Promise.all(promises)
                .then((loadRecordResults) => {
                    // Get user.
                    let user = loadRecordResults[0];
                    let userDescriptions = loadRecordResults[1];

                    let pUser = {};
                    pUser.id = user.id;
                    pUser.firstName = user.firstName;
                    pUser.lastName = user.lastName;
                    pUser.photo = user.photo;

                    pUser.descriptions = userDescriptions;
                    pUser.techniques = [];

                    // Update user information.
                    self.user = pUser;

                    self.$toastr.success('User data has been loaded successfully.');

                    // Unlock the app UI.
                    self.deleteLoadingScreen();
                });
        },
        methods: {

            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Load user hobbies by using specific conditions.
            * */
            loadUserHobbies() {
                // Get current function context.
                let self = this;

                // Get user id.
                return self.$hobby
                    .loadUserHobbies(null, [self.user.id], null)
                    .then((loadUserHobbiesResult) => {
                        return loadUserHobbiesResult.records;
                    })
                    .catch(() => {
                        self.user.hobbies = []
                    });
            },

            /*
            * Load user descriptions by using specific conditions.
            * */
            loadUserDescriptions() {
                // Get function context.
                let self = this;

                return self.$userDescription
                    .loadUserDescriptions(null, [self.user.id], null, null)
                    .then((loadUserDescriptionsResult) => {
                        return loadUserDescriptionsResult.records;
                    })
                    .catch(() => {
                        return [];
                    });
            },

            /*
            * Called when add user description is clicked.
            * */
            vOnAddUserDescriptionClick() {
                this.selectedUserDescription = {
                    userId: this.user.id,
                    description: ''
                };

                this.bUserDescriptionModalOpened = true;
            },

            /*
            * Called when add/edit user description is confirmed adding/editing.
            * */
            vOnUserDescriptionConfirm(model) {
                let self = this;

                // Block UI.
                self.addLoadingScreen();

                self.$userDescription
                    .addUserDescription(model.userId, model.description)
                    .then((userDescription) => {
                        self.bUserDescriptionModalOpened = false;

                        // Add description to list.
                        self.user.descriptions.push(userDescription);

                        self.$toastr.success('Added user description successfully.');
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when add/edit user description is cancelled.
            * */
            vOnUserDescriptionCancel() {
                this.bUserDescriptionModalOpened = false;
            },

            /*
            * Called when profile editor button is clicked.
            * */
            vOnProfileEditClick(){
                this.bUserProfileEditorVisible = true;
            },

            /*
            * Called when image cropper modal cancel button is clicked.
            * */
            vOnImageCropperCancel(){
                this.bUserProfileEditorVisible = false;
            },

            /*
            * Called when profile image is cropped.
            * */
            vOnProfileImageCropped(blob){

                // Get current context.
                let self = this;

                // Get targeted user.
                let user = this.user;

                // Add loading screen.
                self.addLoadingScreen();

                // Initialize upload profile promise.
                let pUploadProfileImagePromise = null;

                pUploadProfileImagePromise = self.$user
                    .uploadProfileImage(user.id, blob);

                pUploadProfileImagePromise
                    .then(() => {
                        self.$toastr.success('User profile image is uploaded.');

                        // Close the modal.
                        self.bUserProfileEditorVisible = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            }
        }
    }
</script>

<style scoped>

</style>