import {ActionContext, ActionTree} from "vuex";
import {AxiosResponse} from 'axios';
import $axios from '@/services/local-axios.service';
import {User} from "@/models/user";
import {LoadUserViewModel} from "@/view-model/user/load-user.view-model";
import {SearchResult} from "@/models/search-result";
import {LoginViewModel} from "@/view-model/user/login.view-model";
import {LoginResultViewModel} from "@/view-model/user/login-result.view-model";
import {RootState} from "@/stores/root/root.state";
import {EditUserViewModel} from "@/view-model/user/edit-user.view-model";
import {UploadProfileImageViewModel} from "@/view-model/user/upload-profile-image.view-model";
import {ApiUrlConstant} from "@/constants/api-url.constant";
import {AppState} from "@/stores/app/app.state";

export const UserServiceAction: ActionTree<RootState, RootState> = {

    //#region Methods

    /*
    * Edit user using specific condition.
    * */
    loadProfile({commit, rootState}: ActionContext<RootState, RootState>, id: number): Promise<User> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .get(`${baseUrl}/api/user/personal-profile/${id}`)
            .then((loadUserResponse: AxiosResponse<User>) => {
                if (!loadUserResponse)
                    throw 'Cannot get user profile';

                return loadUserResponse.data;
            });
    },

    /*
    * Get users by using specific conditions.
    * */
    loadUsers({commit, rootState}: ActionContext<RootState, RootState>, conditions: LoadUserViewModel): Promise<SearchResult<User>> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        console.log(rootState.appSetting);
        return $axios
            .post(`${baseUrl}/api/user/search`, conditions)
            .then((loadUserResponse: AxiosResponse<SearchResult<User>>) => {
                if (!loadUserResponse)
                    throw 'No user has been found';

                let loadUserResult = loadUserResponse.data;
                if (!loadUserResult)
                    throw 'No user has been found';

                return loadUserResult;
            });
    },


    /*
    * Add user using specific conditions.
    * */
    addUser({commit}: ActionContext<RootState, RootState>, user: User): Promise<User> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/user`, user)
            .then((addUserResponse: AxiosResponse<User>) => {
                if (!addUserResponse)
                    throw 'No user has been found';

                let user = addUserResponse.data;
                if (!user)
                    throw 'No user has been found';

                return user;
            });
    },


    /*
    * Edit user using specific condition.
    * */
    editUser({commit}: ActionContext<RootState, RootState>, model: EditUserViewModel): Promise<User> {

        let formData = new FormData();

        if (model.firstName)
            formData.append('firstName', model.firstName);

        if (model.lastName)
            formData.append('lastName', model.lastName);

        if (model.birthday !== null && model.birthday !== undefined)
            formData.append('birthday', `${model.birthday}`);

        if (model.photo)
            formData.append('photo', model.photo);

        let options = {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: [(data: any, headers: Headers) => {
                return data
            }]
        };

        let fullUrl = `${this.baseUrl}/api/user/${model.id}`;
        return $axios
            .put(fullUrl, formData, options)
            .then((uploadUserProfileImageResponse) => {
                if (!uploadUserProfileImageResponse)
                    throw 'Cannot edit user profile';
                return uploadUserProfileImageResponse.data;
            });
    },


    /*
    * Find and delete user.
    * */
    deleteUser({commit}: ActionContext<RootState, RootState>, id: number): Promise<User> {
        return $axios
            .delete(`${this.baseUrl}/api/user/${id}`)
            .then((deleteUserResponse) => {
                if (!deleteUserResponse)
                    throw 'Cannot delete user detail';
                return deleteUserResponse.data;
            });
    },

    /*
    * Login using specific information.
    * */
    login({commit}: ActionContext<RootState, RootState>, loginModel: LoginViewModel): Promise<LoginResultViewModel> {
        return $axios
            .post(`${this.baseUrl}/api/user/login`, loginModel)
            .then((loginResponse: AxiosResponse<LoginResultViewModel>) => {
                if (!loginResponse)
                    throw 'Failed to sign user into system';
                return loginResponse.data;
            });
    },

    /*
    * Upload user profile image.
    * */
    uploadProfileImage({commit}: ActionContext<RootState, RootState>, model: UploadProfileImageViewModel): Promise<void> {

        let formData = new FormData();
        formData.append('photo', model.blob);
        let fullUrl = `${this.baseUrl}/api/user/profile-image/${model.id}`;

        return $axios
            .post(fullUrl, formData, {
                headers: {
                    'Content-Type': null
                }
            })
            .then((uploadUserProfileImageResponse: AxiosResponse<void>) => {
                if (!uploadUserProfileImageResponse)
                    throw 'Cannot upload user profile image';
                return uploadUserProfileImageResponse.data;
            });
    }

    //#endregion
};