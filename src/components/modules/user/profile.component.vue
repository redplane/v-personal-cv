<template>
    <div>
        <!--General information-->
        <div class="row form-group"
             v-if="user">
            <div class="col-xs-4 text-center">
                <div class="profile-image">
                    <img class="img img-thumbnail"
                         v-bind:src="user.photo"/>

                    <button class="btn btn-info btn-camera"
                            @click="vOnProfileEditClick()">
                        <span class="fa fa-camera"></span>
                    </button>
                </div>
            </div>
            <div class="col-xs-8">
                <table class="table table-condensed">
                    <tbody>
                    <tr>
                        <th>Email</th>
                        <td>{{user.email}}</td>
                    </tr>
                    <tr>
                        <th>Full name</th>
                        <td>{{user.firstName}} {{user.lastName}}</td>
                    </tr>
                    <tr>
                        <th>Birthday</th>
                        <td>{{user.birthday | moment("MMMM Do YYYY")}}</td>
                    </tr>
                    <tr>
                        <th>Role</th>
                        <td>{{user.role}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!--User descriptions -->
        <div class="row"
             v-if="user && user.descriptions"
             v-for="item in user.descriptions">
            <div class="form-group">
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading clearfix"
                             v-if="bIsAbleToEditProfile">
                            <div class="pull-right">
                                <button class="btn btn-danger"
                                        @click="deleteProfileDescription(item.id)">
                                    <span class="fa fa-trash"></span>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-primary"
                                        @click="vOnEditProfileDescriptionClick(item)">
                                    <span class="fa fa-edit"></span>
                                </button>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div v-html="item.description"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--Add user description-->
        <div v-if="bIsAbleToEditProfile"
             class="form-group">
            <a href="javascript:void(0)"
               @click="vOnAddUserDescriptionClick">Add description</a>
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
                <profile-description-detail-component :user-description-property="oSelectedUserDescription"
                                                      v-on:click-confirm="vOnUserDescriptionConfirm($event)"
                                                      v-on:click-cancel="vOnUserDescriptionCancel()"></profile-description-detail-component>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Getter, Action, Mutation} from 'vuex-class'
    import {UserDescription} from "../../../models/user-description";
    import {Profile} from "../../../models/profile";
    import {SearchResult} from "../../../models/search-result";
    import {User} from "../../../models/user";
    import {UserViewModel} from "../../../view-model/user/user.view-model";
    import {UserRoles} from "../../../enumerations/user-role.enum";

    import ProfileDescriptionDetailComponent from "./profile-description-detail.component.vue";
    import ImageCropper from '../../shared/image-cropper/image-cropper.component.vue';
    import {EditUserViewModel} from "../../../view-model/user/edit-user.view-model";
    import {LoadUserViewModel} from "../../../view-model/user/load-user.view-model";
    import {LoadUserDescriptionViewModel} from "../../../view-model/user-description/load-user-description.view-model";
    import {AddUserDescriptionViewModel} from "../../../view-model/user-description/add-user-description.view-model";
    import {EditUserDescriptionViewModel} from "../../../view-model/user-description/edit-user-description.view-model";
    import toastr from 'toastr';

    @Component({
        components: {
            ProfileDescriptionDetailComponent,
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
        private oSelectedUserDescription: UserDescription = new UserDescription();

        /*
        * Profile which is selected for editing.
        * */
        private oSelectedProfile: User = null;

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
        @Getter('profile', {namespace: 'app'})
        private profile: Profile;

        //#endregion

        //#region Methods

        /*
        * Add loading screen to UI.
        * */
        @Mutation('addLoadingScreen', {namespace: 'app'})
        private addLoadingScreen: () => void;

        /*
        * Delete loading screen on UI.
        * */
        @Mutation('deleteLoadingScreen')
        private deleteLoadingScreen: () => void;

        @Action('editUser', {namespace: 'apiUser'})
        private editUserAsync: (editUserModel: EditUserViewModel) => Promise<User>;

        @Action('loadUsers', {namespace: 'apiUser'})
        private loadUsersAsync: (loadUsersCondition: LoadUserViewModel) => Promise<SearchResult<User[]>>;

        @Action('loadUserDescriptions', {namespace: 'apiUserDescription'})
        private loadUserDescriptionsAsync: (condition: LoadUserDescriptionViewModel) => Promise<SearchResult<UserDescription[]>>;

        @Action('deleteUserDescription', {namespace: 'apiUserDescription'})
        private deleteUserDescriptionAsync: (id: number) => Promise<void>;

        @Action('addUserDescription')
        private addUserDescriptionAsync: (addUserDescriptionModel: AddUserDescriptionViewModel) => Promise<UserDescription>;

        @Action('editUserDescription')
        private editUserDescriptionAsync: (editUserDescriptionModel: EditUserDescriptionViewModel) => Promise<UserDescription>;


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
            this.user = new UserViewModel();
        }

        //#endregion

        //#region Methods

        /*
        * Load user descriptions.
        * */
        public loadUserDescriptions(): Promise<UserDescription[]> {

            let condition = new LoadUserDescriptionViewModel();
            condition.userIds = [this.userId];
            condition.pagination = null;

            return this
                .loadUserDescriptionsAsync(condition)
                .then((loadUserDescriptionsResult: SearchResult<UserDescription[]>) => {
                    return loadUserDescriptionsResult.records;
                })
                .catch(() => {
                    return [];
                });
        }

        /*
        * Delete profile description.
        * */
        public deleteProfileDescription(id: number): void {
            this.deleteUserDescriptionAsync(id)
                .then(() => {
                    // Display success message.
                    toastr.success('Description has been deleted successfully.');
                    return this.loadUserDescriptions();
                })
                .then((descriptions: UserDescription[]) => {
                    this.user.descriptions = descriptions;
                    return true;
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

                promises[0] = this
                    .loadUsersAsync(condition)
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

                    toastr.success('User data has been loaded successfully.');
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
        * Called when edit user description is clicked.
        * */
        public vOnEditProfileDescriptionClick(model: UserDescription): void {
            this.oSelectedUserDescription = Object.assign({}, model);
            this.bAddEditUserDescriptionModalOpened = true;
        }

        /*
        * Called when add/edit user description is confirmed adding/editing.
        * */
        public vOnUserDescriptionConfirm(model: UserDescription): void {
            // Block UI.
            this.addLoadingScreen();

            // Add/edit user description promise.
            let pAddEditProfileDescriptionPromise = null;

            if (!model.id) {

                let addUserDescriptionModel = new AddUserDescriptionViewModel();
                addUserDescriptionModel.userId = model.userId;
                addUserDescriptionModel.description = model.description;

                pAddEditProfileDescriptionPromise = this
                    .addUserDescriptionAsync(addUserDescriptionModel)
                    .then((userDescription: UserDescription) => {
                        this.bAddEditUserDescriptionModalOpened = false;
                        toastr.success('Added user description successfully.');
                        return true;
                    });
            } else {

                let editUserDescription = new EditUserDescriptionViewModel();
                editUserDescription.id = model.id;
                editUserDescription.description = model.description;

                pAddEditProfileDescriptionPromise = this
                    .editUserDescriptionAsync(editUserDescription)
                    .then((userDescription: UserDescription) => {
                        this.bAddEditUserDescriptionModalOpened = false;
                        toastr.success('Added user description successfully.');
                        return true;
                    });
            }

            pAddEditProfileDescriptionPromise
                .then(() => {
                    // Reload profile description.
                    return this.loadUserDescriptions();
                })
                .then((descriptions: Array<UserDescription>) => {
                    this.user.descriptions = descriptions;
                    this.bAddEditUserDescriptionModalOpened = false;
                    return true;
                });

            pAddEditProfileDescriptionPromise.finally(() => {
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
        public vOnProfileEditClick(): void {
            this.bUserProfileEditorVisible = true;
        }

        /*
        * Called when image cropper modal cancel button is clicked.
        * */
        public vOnImageCropperCancel(): void {
            this.bUserProfileEditorVisible = false;
        }

        /*
        * Called when profile image is cropped.
        * */
        public vOnProfileImageCropped(blob: Blob): void {
            // Get targeted user.
            let user = this.user;
            if (!user)
                return;

            // Add loading screen.
            this.addLoadingScreen();

            let editUserModel = new EditUserViewModel();
            editUserModel.id = user.id;
            editUserModel.photo = blob;

            this.editUserAsync(editUserModel)
                .then((user: User) => {
                    toastr.success('User profile image is uploaded.');

                    // Update profile image.
                    if (this.user)
                        this.user.photo = user.photo;

                    // Close the modal.
                    this.bUserProfileEditorVisible = false;
                    return true;
                })
                .finally(() => {
                    this.deleteLoadingScreen();
                });
        }

        //#endregion

        //#endregion
    }

</script>

<style scoped>
    .profile-image {
        max-height: 256px;
        max-width: 256px;
        position: relative;;
    }

    .profile-image .btn-camera {
        position: absolute;
        bottom: 5px;
        left: 5px;
        border-radius: 0;
    }
</style>