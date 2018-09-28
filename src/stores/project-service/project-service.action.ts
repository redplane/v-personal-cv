import {ActionContext, ActionTree} from "vuex";
import {RootState} from "@/stores/root/root.state";
import $axios from '@/services/local-axios.service';
import {ApiUrlConstant} from "@/constants/api-url.constant";
import {SearchResult} from "@/models/search-result";
import {AxiosResponse} from "axios";
import {LoadProjectViewModel} from "@/view-model/project/load-project.view-model";
import {Project} from "@/models/project";
import {AddProjectViewModel} from "@/view-model/project/add-project.view-model";
import {EditProjectViewModel} from "@/view-model/project/edit-project.view-model";
import {LoadProjectResponsibilityRelationshipViewModel} from "@/view-model/project-responsibility-relationship/load-project-responsibility-relationship.view-model";
import {ProjectResponsibility} from "@/models/project-responsibility";
import {AddProjectResponsibilityViewModel} from "@/view-model/project-responsibility-relationship/add-project-responsibility.view-model";
import {LoadProjectSkillRelationshipViewModel} from "@/view-model/project-skill-relationship/load-project-skill-relationship.view-model";
import {ProjectSkillRelationship} from "@/models/project-skill-relationship";

export const ProjectServiceAction: ActionTree<RootState, RootState> = {

    //#region Methods

    /*
    * Get projects by using specific conditions.
    * */
    loadProjects({commit}: ActionContext<RootState, RootState>, conditions: LoadProjectViewModel): Promise<SearchResult<Project[]>> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/project/search`, conditions)
            .then((loadProjectResponse) => {
                if (!loadProjectResponse)
                    throw 'No project is found';

                let loadProjectResult = loadProjectResponse.data;
                if (!loadProjectResult)
                    throw 'No project is found';

                return loadProjectResult;
            });
    },

    /*
    * Add project by using specific information.
    * */
    addProject({commit}: ActionContext<RootState, RootState>, model: AddProjectViewModel): Promise<Project> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/project`, model)
            .then((addProjectResponse) => {
                if (!addProjectResponse)
                    throw 'Failed to add project';

                return addProjectResponse.data;
            });
    },

    /*
    * Edit project by using specific information.
    * */
    editProject({commit}: ActionContext<RootState, RootState>, model: EditProjectViewModel): Promise<Project> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/project/${model.id}`, model)
            .then((addProjectResponse: AxiosResponse<Project>) => {
                if (!addProjectResponse)
                    throw 'Failed to add project';

                return addProjectResponse.data;
            });
    },

    /*
    * Delete user project
    * */
    deleteProject({commit}: ActionContext<RootState, RootState>, id: number): Promise<void> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .delete(`${baseUrl}/api/project/${id}`)
            .then((deleteProjectResponse) => {
                if (!deleteProjectResponse)
                    throw 'Failed to delete project';

                return;
            });
    },

    /*
    * Load project responsibilities by using specific conditions.
    * */
    loadProjectResponsibilityRelationships({commit}: ActionContext<RootState, RootState>, condition: LoadProjectResponsibilityRelationshipViewModel): Promise<SearchResult<ProjectResponsibility[]>> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/project-responsibility/search`, condition)
            .then((loadProjectResponsibilityResponse: AxiosResponse<SearchResult<ProjectResponsibility[]>>) => {
                if (!loadProjectResponsibilityResponse)
                    throw 'No project responsibility is found';

                let loadProjectResponsibilityResult = loadProjectResponsibilityResponse.data;
                if (!loadProjectResponsibilityResult)
                    throw 'No project responsibility is found';

                return loadProjectResponsibilityResult;
            });
    },

    /*
    * Add project responsibility relationship by using specific information.
    * */
    addProjectResponsibilityRelationship({commit}: ActionContext<RootState, RootState>, addProjectResponsibilityModel: AddProjectResponsibilityViewModel): Promise<ProjectResponsibility> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/project-responsibility`, addProjectResponsibilityModel)
            .then((addProjectResponsibilityResponse: AxiosResponse<ProjectResponsibility>) => {
                if (!addProjectResponsibilityResponse)
                    throw 'Failed to add project responsibility';

                return addProjectResponsibilityResponse.data;
            });

    },

    /*
    * Load project skill relationships.
    * */
    loadProjectSkillRelationships({commit}: ActionContext<RootState, RootState>, condition: LoadProjectSkillRelationshipViewModel): Promise<SearchResult<ProjectSkillRelationship[]>> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/project-skill/search`, condition)
            .then((loadProjectSkillRelationshipsResponse: AxiosResponse<SearchResult<ProjectSkillRelationship[]>>) => {
                if (!loadProjectSkillRelationshipsResponse)
                    throw 'No project skill is found';

                let loadProjectSkillRelationshipsResult = loadProjectSkillRelationshipsResponse.data;
                if (!loadProjectSkillRelationshipsResult)
                    throw 'No project skill is found';

                return loadProjectSkillRelationshipsResult;
            });
    }

    //#endregion
};