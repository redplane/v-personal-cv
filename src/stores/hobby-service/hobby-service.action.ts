import {ActionContext, ActionTree} from "vuex";
import {RootState} from "@/stores/root/root.state";
import $axios from '@/services/local-axios.service';
import {ApiUrlConstant} from "@/constants/api-url.constant";
import {LoadHobbyViewModel} from "@/view-model/hobby/load-hobby.view-model";
import {SearchResult} from "@/models/search-result";
import {Hobby} from "@/models/hobby";
import {AxiosResponse} from "axios";

export const HobbyServiceAction: ActionTree<RootState, RootState> = {

    //#region Methods

    /*
    * Get hobbies by using specific conditions.
    * */
    loadHobbies({commit}: ActionContext<RootState, RootState>, conditions: LoadHobbyViewModel): Promise<SearchResult<Hobby[]>> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/hobby/search`, conditions)
            .then((loadHobbiesResponse: AxiosResponse<SearchResult<Hobby[]>>) => {
                if (!loadHobbiesResponse)
                    throw 'No hobby is found';

                let loadHobbiesResult = loadHobbiesResponse.data;
                if (!loadHobbiesResult)
                    throw 'No hobby is found';

                return loadHobbiesResult;
            });
    },

    /*
    * Add hobby.
    * */
    addHobby({commit}: ActionContext<RootState, RootState>, hobby: Hobby): Promise<Hobby> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/hobby`, hobby)
            .then((addHobbyResponse: AxiosResponse<Hobby>) => {
                if (!addHobbyResponse)
                    throw 'Failed to add hobby';

                let hobby = addHobbyResponse.data;
                if (!hobby)
                    throw 'Failed to add user description';

                return hobby;
            });
    },

    /*
    * Edit user using specific condition.
    * */
    editHobby({commit}: ActionContext<RootState, RootState>, hobby: Hobby): Promise<Hobby> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/hobby/${hobby.id}`, hobby)
            .then((editHobbyResponse) => {
                if (!editHobbyResponse)
                    throw 'Cannot edit hobby';

                return editHobbyResponse.data;
            });
    },

    /*
    * Find and delete user.
    * */
    deleteHobby({commit}: ActionContext<RootState, RootState>, id: number): Promise<void> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .delete(`${baseUrl}/api/hobby/${id}`)
            .then((deleteHobbyResponse) => {
                if (!deleteHobbyResponse)
                    throw 'Cannot delete hobby';
                return deleteHobbyResponse.data;
            });
    }

    //#endregion
};