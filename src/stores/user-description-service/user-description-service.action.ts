import {ActionContext, ActionTree} from "vuex";
import {AxiosResponse} from 'axios';
import $axios from '@/services/local-axios.service';
import {SearchResult} from "@/models/search-result";
import {RootState} from "@/stores/root/root.state";
import {ApiUrlConstant} from "@/constants/api-url.constant";
import {LoadUserDescriptionViewModel} from "@/view-model/user-description/load-user-description.view-model";
import {UserDescription} from "@/models/user-description";
import {AddUserDescriptionViewModel} from "@/view-model/user-description/add-user-description.view-model";
import {EditUserDescriptionViewModel} from "@/view-model/user-description/edit-user-description.view-model";

export const UserDescriptionServiceAction: ActionTree<RootState, RootState> = {

    //#region Methods

    /*
    * Get users by using specific conditions.
    * */
    loadUserDescriptions({commit}: ActionContext<RootState, RootState>, condition: LoadUserDescriptionViewModel): Promise<SearchResult<UserDescription>> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/user-description/search`, condition)
            .then((loadUserDescriptionResponse: AxiosResponse<SearchResult<UserDescription>>) => {
                if (!loadUserDescriptionResponse)
                    throw 'No description is found';

                let loadUserDescriptionResult = loadUserDescriptionResponse.data;
                if (!loadUserDescriptionResult)
                    throw 'No description is found';

                return loadUserDescriptionResult;
            });
    },

    /*
    * Add user using specific conditions.
    * */
    addUserDescription({commit}: ActionContext<RootState, RootState>, addUserDescriptionModel: AddUserDescriptionViewModel): Promise<UserDescription> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/user-description`, addUserDescriptionModel)
            .then((addUserDescriptionResponse: AxiosResponse<UserDescription>) => {
                if (!addUserDescriptionResponse)
                    throw 'Failed to add user description';

                let userDescription = addUserDescriptionResponse.data;
                if (!userDescription)
                    throw 'Failed to add user description';

                return userDescription;
            });
    },

    /*
    * Edit user using specific condition.
    * */
    editUserDescription({commit}: ActionContext<RootState, RootState>, editUserDescriptionModel: EditUserDescriptionViewModel): Promise<UserDescription> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/user-description/${editUserDescriptionModel.id}`, editUserDescriptionModel)
            .then((editUserDescriptionResponse: AxiosResponse<UserDescription>) => {
                if (!editUserDescriptionResponse)
                    throw 'Cannot edit user detail';

                return editUserDescriptionResponse.data;
            });
    },

    /*
    * Find and delete user.
    * */
    deleteUserDescription({commit}: ActionContext<RootState, RootState>, id: number): Promise<void> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .delete(`${baseUrl}/api/user-description/${id}`)
            .then((deleteUserDescriptionResponse: AxiosResponse<void>) => {
                if (!deleteUserDescriptionResponse)
                    throw 'Cannot delete user description';
                return deleteUserDescriptionResponse.data;
            });
    }

    //#endregion
};