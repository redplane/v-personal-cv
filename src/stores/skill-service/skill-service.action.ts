import {ActionContext, ActionTree} from "vuex";
import {RootState} from "@/stores/root/root.state";
import $axios from '@/services/local-axios.service';
import {SearchResult} from "@/models/search-result";
import {ApiUrlConstant} from "@/constants/api-url.constant";
import {AxiosResponse} from "axios";
import {LoadSkillCategoryViewModel} from "@/view-model/skill-category/load-skill-category.view-model";
import {SkillCategory} from "@/models/skill-category";
import {AddSkillCategoryViewModel} from "@/view-model/skill-category/add-skill-category.view-model";
import {AddSkillsToCategoryViewModel} from "@/view-model/skill-category/add-skills-to-category.view-model";
import {EditSkillCategoryViewModel} from "@/view-model/skill-category/edit-skill-category.view-model";
import {Skill} from "@/models/skill";
import {EditSkillViewModel} from "@/view-model/skill/edit-skill.view-model";
import {LoadSkillCategorySkillRelationshipViewModel} from "@/view-model/skill/load-skill-category-skill-relationship.view-model";
import {ProjectSkillRelationship} from "@/models/project-skill-relationship";
import {AddSkillCategorySkillRelationshipViewModel} from "@/view-model/skill-category-skill-relationship/add-skill-category-skill-relationship.view-model";
import {EditSkillCategorySkillRelationshipViewModel} from "@/view-model/skill-category-skill-relationship/edit-skill-category-skill-relationship.view-model";
import {LoadSkillViewModel} from "@/view-model/skill/load-skill.view-model";
import {UploadSkillCategoryPhotoViewModel} from "@/view-model/skill-category/upload-skill-category-photo.view-model";
import {DeleteCategorySkillRelationshipViewModel} from "@/view-model/skill-category-skill-relationship/delete-category-skill-relationship.view-model";
import {AddSkillViewModel} from "@/view-model/skill/add-skill.view-model";

export const SkillServiceAction: ActionTree<RootState, RootState> = {

    //#region Methods

    /*
    * Get hobbies by using specific conditions.
    * */
    loadSkillCategories({commit}: ActionContext<RootState, RootState>, condition: LoadSkillCategoryViewModel): Promise<SearchResult<SkillCategory[]>> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/skill-category/search`, condition)
            .then((loadSkillCategoriesResponse: AxiosResponse<SearchResult<SkillCategory[]>>) => {
                if (!loadSkillCategoriesResponse)
                    throw 'No skill category is found';

                let loadSkillCategoriesResult = loadSkillCategoriesResponse.data;
                if (!loadSkillCategoriesResult)
                    throw 'No skill category is found';

                return loadSkillCategoriesResult;
            });
    },

    /*
    * Add skill category by using specific information.
    * */
    addSkillCategory({commit}: ActionContext<RootState, RootState>, addSkillModel: AddSkillCategoryViewModel): Promise<SkillCategory> {
        // Initialize model to submit api.
        let fd = new FormData();
        fd.append('userId', `${addSkillModel.userId}`);
        fd.append('photo', addSkillModel.photo);
        fd.append('name', addSkillModel.name);

        let headers = {
            'Content-Type': null
        };

        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/skill-category`, fd, {
                headers
            })
            .then((loadSkillCategoriesResponse: AxiosResponse<SkillCategory>) => {
                if (!loadSkillCategoriesResponse)
                    throw 'No skill category is found';

                let loadSkillCategoriesResult = loadSkillCategoriesResponse.data;
                if (!loadSkillCategoriesResult)
                    throw 'No skill category is found';

                return loadSkillCategoriesResult;
            });
    },

    /*
    * Add skills to a specific category.
    * */
    addSkillsToCategory({commit}: ActionContext<RootState, RootState>, model: AddSkillsToCategoryViewModel): Promise<void> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/skill-category-skill`, model)
            .then((addSkillCategoriesResponse: AxiosResponse<void>) => {
                if (!addSkillCategoriesResponse)
                    throw 'Failed to add skills to skill category';
                return addSkillCategoriesResponse.data;
            });
    },

    /*
    * Edit skill category by using specific information.
    * */
    editSkillCategory({commit}: ActionContext<RootState, RootState>, model: EditSkillCategoryViewModel): Promise<void> {
        // Initialize model to submit api.
        let fd = new FormData();

        if (model.photo)
            fd.append('photo', model.photo);

        if (model.name)
            fd.append('name', model.name);

        let options = {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: [(data: any, headers: Headers) => {
                return data
            }]
        };

        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/skill-category/${model.id}`, fd, options)
            .then((editSkillCategoryResponse) => {
                if (!editSkillCategoryResponse)
                    throw 'Failed to edit skill category';
                return editSkillCategoryResponse.data;
            });
    },

    /*
    * Add skill to the system.
    * */
    addSkill({commit}: ActionContext<RootState, RootState>, model: AddSkillViewModel): Promise<Skill> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        let promise = $axios
            .post(`${baseUrl}/api/skill`, model);

        return promise
            .then((editSkillCategoryResponse: AxiosResponse<Skill>) => {
                if (!editSkillCategoryResponse)
                    throw 'Failed to edit skill category';
                return editSkillCategoryResponse.data;
            });
    },

    /*
    * Edit skill by searching for its id.
    * */
    editSkill({commit}: ActionContext<RootState, RootState>, editSkillModel: EditSkillViewModel): Promise<Skill> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/skill/${editSkillModel.id}`, editSkillModel)
            .then((editSkillCategoryResponse: AxiosResponse<Skill>) => {
                if (!editSkillCategoryResponse)
                    throw 'Failed to edit skill category';
                return editSkillCategoryResponse.data;
            });
    },

    /*
    * Delete a skill by using specific id.
    * */
    deleteSkill({commit}: ActionContext<RootState, RootState>, id: number): Promise<void> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .delete(`${baseUrl}/api/skill/${id}`)
            .then((editSkillCategoryResponse: AxiosResponse<void>) => {
                if (!editSkillCategoryResponse)
                    throw 'Failed to delete skill category';
            });
    },

    /*
    * Add hobby.
    * */
    loadSkillCategorySkillRelationships({commit}: ActionContext<RootState, RootState>, condition: LoadSkillCategorySkillRelationshipViewModel): Promise<SearchResult<ProjectSkillRelationship[]>> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/skill-category-skill/search`, condition)
            .then((loadSkillCategorySkillRelationshipResponse: AxiosResponse<SearchResult<ProjectSkillRelationship[]>>) => {
                if (!loadSkillCategorySkillRelationshipResponse)
                    throw 'Failed to load skill-category-skill relationship.';

                let loadSkillCategorySkillRelationshipsResult = loadSkillCategorySkillRelationshipResponse.data;
                if (!loadSkillCategorySkillRelationshipsResult)
                    throw 'Failed to load skill-category-skill relationship.';

                return loadSkillCategorySkillRelationshipsResult;
            });
    },

    /*
    * Add skill category - skill relationship.
    * */
    addSkillCategorySkillRelationship({commit}: ActionContext<RootState, RootState>, model: AddSkillCategorySkillRelationshipViewModel): Promise<void> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/skill-category-skill`, model)
            .then((addSkillCategorySkillResponse: AxiosResponse<void>) => {
                if (!addSkillCategorySkillResponse)
                    throw 'Failed to add skill-category-skill relationship.';
            });
    },

    /*
    * Edit skill category - skill relationship.
    * */
    editSkillCategorySkillRelationship({commit}: ActionContext<RootState, RootState>, model: EditSkillCategorySkillRelationshipViewModel): Promise<void> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .put(`${baseUrl}/api/skill-category-skill?skillCategoryId=${model.skillCategoryId}&skillId=${model.skillId}`, model)
            .then((editSkillCategorySkillRelationshipResponse) => {
                if (!editSkillCategorySkillRelationshipResponse)
                    throw 'Failed to edit skill-category-skill relationship.';

                return editSkillCategorySkillRelationshipResponse.data;
            });
    },

    /*
    * Edit user using specific condition.
    * */
    loadSkills({commit}: ActionContext<RootState, RootState>, condition: LoadSkillViewModel): Promise<SearchResult<Skill[]>> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .post(`${baseUrl}/api/skill/search`, condition)
            .then((loadSkillsResponse: AxiosResponse<SearchResult<Skill[]>>) => {
                if (!loadSkillsResponse)
                    throw 'No skill is found';
                return loadSkillsResponse.data;
            });
    },

    /*
    * Load upload skill category photo.
    * */
    uploadSkillCategoryPhoto({commit}: ActionContext<RootState, RootState>, model: UploadSkillCategoryPhotoViewModel): Promise<void> {

        let baseUrl = ApiUrlConstant.baseUrlEndPoint;

        // Initialize form data.
        let formData = new FormData();
        formData.append('photo', model.file);

        return $axios
            .put(`${baseUrl}/api/skill-category/photo/${model.skillCategoryId}`, formData)
            .then((uploadSkillCategoryPhotoResponse: AxiosResponse<void>) => {
                if (!uploadSkillCategoryPhotoResponse)
                    throw 'Failed to upload skill category photo';
            });
    },

    /*
    * Delete skill category - skill relationship using specific conditions.
    * */
    deleteSkillCategorySkillRelationship({commit}: ActionContext<RootState, RootState>, model: DeleteCategorySkillRelationshipViewModel): Promise<void> {
        let baseUrl = ApiUrlConstant.baseUrlEndPoint;
        return $axios
            .delete(`${baseUrl}/api/skill-category-skill?skillCategoryId=${model.skillCategoryId}&skillId=${model.skillId}`)
            .then((loadSkillsResponse) => {
                if (!loadSkillsResponse)
                    throw 'No skill category - skill relationship is found';
            });
    }

    //#endregion
};