<template>
    <div>
        <!--General information-->
        <div class="row"
             v-if="user">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading"><h3 class="panel-title">About {{user.firstName}}
                        {{user.lastName}}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="panel-default">
                                    <div class="panel-body text-center">
                                        <img class="img img-thumbnail"
                                             v-bind:src="user.photo"/>
                                    </div>
                                    <div class="panel-footer text-center" v-if="bIsAbleToEditProfile">
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
                                    <li v-if="bIsAbleToEditProfile">
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
               v-model="bAddEditUserDescriptionModalOpened"
               v-if="bAddEditUserDescriptionModalOpened"
               class="replace-body">
            <div slot="default">
                <user-description-detail :user-description-property="oSelectedUserDescription"
                                         v-on:click-confirm="vOnUserDescriptionConfirm($event)"
                                         v-on:click-cancel="vOnUserDescriptionCancel()"></user-description-detail>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State, Getter, Action, Mutation, namespace} from 'vuex-class'
    import {UserDescription} from "../../../models/user-description";
    import {Profile} from "../../../models/profile";
    import {SearchResult} from "../../../models/search-result";
    import {User} from "../../../models/user";
    import {UserViewModel} from "../../../view-model/user/user.view-model";
    import {UserRoles} from "../../../enumerations/user-role.enum";

    import UserDescriptionDetail from "./user-description-detail.vue";
    import ImageCropper from '../../shared/image-cropper.vue';
    import {EditUserViewModel} from "../../../view-model/user/edit-user.view-model";

    @Component({
        dependencies: ['$user', '$userDescription', '$toastr'],
        components: {
            UserDescriptionDetail,
            ImageCropper
        }
    })
    export default class ProfileComponent extends Vue {


        //#region Properties

        /*
        * Whether add/edit user description modal is opened or not.
        * */
        private bAddEditUserDescriptionModalOpened: boolean = false;

        /*
        * Whether user profile editor is visible or not.
        * */
        private bUserProfileEditorVisible: boolean = false;


        /*
        * User description that is selected for editing.
        * */
        private oSelectedUserDescription: UserDescription | null = null;

        /*
        * User id which has this profile information.
        * */
        private userId: number = 0;

        /*
        * User instance.
        * */
        private user: UserViewModel | null = null;

        /*
        * User profile which is using system.
        * */
        @Getter('profile')
        private profile: Profile;

        /*
        * Vue router service.
        * */
        // private $route: any;

        private $user: any;
        private $userDescription: any;
        private $toastr: any;

        //#endregion

        //#region Methods

        /*
        * Add loading screen to UI.
        * */
        @Mutation('addLoadingScreen') addLoadingScreen: any;

        /*
        * Delete loading screen on UI.
        * */
        @Mutation('deleteLoadingScreen') deleteLoadingScreen: any;

        /*
        * Check whether user is able to add user description or not.
        * */
        public get bIsAbleToEditProfile(): boolean {
            // Profile not found.
            if (!this.profile)
                return false;

            let profile = this.profile;
            // Profile is not an admin.
            if (this.profile.role !== UserRoles.admin) {
                if (profile.id !== this.userId)
                    return false;

                return true;
            }

            return true;

        }

        //#endregion

        //#region Constructor

        constructor() {
            super();

            console.log(this.$user);
        }

        //#endregion

        //#region Methods

        /*
        * Load user descriptions.
        * */
        public loadUserDescriptions(): Promise<UserDescription[]> {
            return this.$userDescription
                .loadUserDescriptions(null, [this.userId], null, null)
                .then((loadUserDescriptionsResult: SearchResult<UserDescription[]>) => {
                    return loadUserDescriptionsResult.records;
                })
                .catch(() => {
                    return [];
                });
        }


        //#endregion

        //#region Events

        /*
        * Called when component is mounted successfully.
        * */
        public mounted() {
            // Get params in route.
            let params: any = this.$route.params;
            let userId = parseInt(params['userId']);
            this.userId = userId;

            // Block UI.
            this.addLoadingScreen();

            // List of promises that needs resolving.
            let promises = [];

            // Find user information from cache. This is for preventing requesting to api end-point too many times.
            let user = <User> params.user;
            if (user) {
                promises[0] = new Promise((resolve) => {
                    resolve(user);
                });
            } else {

                // Build search condition.
                let condition = {
                    userIds: [userId],
                    pagination: {
                        page: 1,
                        records: 1
                    }
                };

                promises[0] = this.$user
                    .loadUsers(condition)
                    .then((loadUsersResult: SearchResult<User[]>) => {
                        // Get users.
                        let users = loadUsersResult.records;
                        return users[0];
                    });
            }

            //Load user descriptions
            promises[1] = this.loadUserDescriptions();

            //#endregion

            Promise.all(promises)
                .then((loadRecordResults: Array<any>) => {
                    // Get user.
                    this.user = <UserViewModel> loadRecordResults[0];

                    // Update user descriptions.
                    let userDescriptions = <UserDescription[]> loadRecordResults[1];
                    this.user.descriptions = userDescriptions;

                    this.$toastr.success('User data has been loaded successfully.');
                    return true;
                })
                .then(() => {
                    // Unlock the app UI.
                    this.deleteLoadingScreen();
                });
        }

        //#region User descriptions

        /*
        * Called when add user description is clicked.
        * */
        public vOnAddUserDescriptionClick(): void {
            this.oSelectedUserDescription = new UserDescription();
            this.oSelectedUserDescription.id = 0;
            this.oSelectedUserDescription.description = '';
            this.oSelectedUserDescription.userId = this.userId;

            this.bAddEditUserDescriptionModalOpened = true;
        }

        /*
        * Called when add/edit user description is confirmed adding/editing.
        * */
        public vOnUserDescriptionConfirm(model: UserDescription): void {
            // Block UI.
            this.addLoadingScreen();

            this.$userDescription
                .addUserDescription(model.userId, model.description)
                .then((userDescription: UserDescription) => {
                    this.bAddEditUserDescriptionModalOpened = false;

                    // Add description to list.
                    this.user.descriptions.push(userDescription);

                    this.$toastr.success('Added user description successfully.');
                    return true;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        /*
        * Called when add/edit user description is cancelled.
        * */
        public vOnUserDescriptionCancel(): void {
            this.bAddEditUserDescriptionModalOpened = false;
        }

        //#endregion

        //#region Profile photo

        /*
        * Called when profile editor button is clicked.
        * */
        vOnProfileEditClick() {
            this.bUserProfileEditorVisible = true;
        }

        /*
        * Called when image cropper modal cancel button is clicked.
        * */
        vOnImageCropperCancel() {
            this.bUserProfileEditorVisible = false;
        }

        /*
        * Called when profile image is cropped.
        * */
        vOnProfileImageCropped(blob: Blob) {

            // Get current context.
            let self = this;

            // Get targeted user.
            let user = this.user;
            if (!user)
                return;

            // Add loading screen.
            this.addLoadingScreen();

            let editUserOption = new EditUserViewModel();
            editUserOption.photo = blob;

            this.$user
                .editUser(user.id, editUserOption, blob)
                .then((user: User) => {
                    this.$toastr.success('User profile image is uploaded.');

                    // Update profile image.
                    if (this.user)
                        this.user.photo = user.photo;

                    // Close the modal.
                    this.bUserProfileEditorVisible = false;
                    return true;
                })
                .finally(() => {
                    self.deleteLoadingScreen();
                });
        }

        //#endregion

        //#endregion
    }

</script>