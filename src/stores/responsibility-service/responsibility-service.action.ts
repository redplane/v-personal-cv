import {ActionContext, ActionTree} from "vuex";
import {RootState} from "@/stores/root/root.state";
import {LoadResponsibilityViewModel} from "@/view-model/load-responsibility.view-model";
import $axios from '@/services/local-axios.service';
import {SearchResult} from "@/models/search-result";
import {Responsibility} from "@/models/responsibility";
import {ApiUrlConstant} from "@/constants/api-url.constant";
import {AxiosResponse} from "axios";

export const ResponsibilityServiceAction: ActionTree<RootState, RootState> = {

    //#region Methods

    // Load responsibilities using specific information.
    loadResponsibilities({commit}: ActionContext<RootState, RootState>, conditions: LoadResponsibilityViewModel): Promise<SearchResult<Responsibility[]>> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/responsibility/search`, conditions)
            .then((loadSkillResponse) => {
                if (!loadSkillResponse)
                    throw 'No skill has been found';

                let loadSkillResult = loadSkillResponse.data;
                if (!loadSkillResult)
                    throw 'No skill has been found';

                return loadSkillResult;
            });
    },

    /*
    * Add user using specific conditions.
    * */
    addResponsibility({commit}: ActionContext<RootState, RootState>, responsibility: Responsibility): Promise<Responsibility> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/responsibility`, responsibility)
            .then((addResponsibilityResponse: AxiosResponse<Responsibility>) => {
                if (!addResponsibilityResponse)
                    throw 'Failed to add responsibility';

                let addResponsibilityResult = addResponsibilityResponse.data;
                if (!addResponsibilityResult)
                    throw 'Failed to add responsibility';

                return addResponsibilityResult;
            });
    },

    /*
    * Edit user using specific condition.
    * */
    editResponsibility({commit}: ActionContext<RootState, RootState>, responsibility: Responsibility): Promise<Responsibility> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/responsibility/${responsibility.id}`, responsibility)
            .then((editResponsibilityResponse: AxiosResponse<Responsibility>) => {
                if (!editResponsibilityResponse)
                    throw 'Failed to add edit responsibility';

                return editResponsibilityResponse.data;
            });
    },

    /*
    * Find and delete user.
    * */
    deleteResponsibility({commit}: ActionContext<RootState, RootState>, id: number): Promise<void> {
        let baseUrl: string = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .delete(`${baseUrl}/api/responsibility/${id}`)
            .then((deleteResponsibilityResponse) => {
                if (!deleteResponsibilityResponse)
                    throw 'Cannot delete responsibility detail';
                return deleteResponsibilityResponse.data;
            });
    }

    //#endregion
};