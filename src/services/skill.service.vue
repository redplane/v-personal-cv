<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$skill', ['baseUrl'], (baseUrl) => {
            return {

                //#region Methods

                /*
                * Get hobbies by using specific conditions.
                * */
                loadSkillCategories(ids, userIds) {

                    // Construct search model.
                    let condition = {
                        ids: ids,
                        userIds: userIds
                    };

                    return axios
                        .post(`${baseUrl}/api/skill-category/search`, condition)
                        .then((loadSkillCategoriesResponse) => {
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
                addSkillCategory(id, userId, photo, name) {

                    // Initialize model to submit api.
                    let model = {
                        id: id,
                        userId: userId,
                        photo: photo,
                        name: name
                    };

                    return axios
                        .post(`${baseUrl}/api/skill-category/search`, model)
                        .then((loadSkillCategoriesResponse) => {
                            if (!loadSkillCategoriesResponse)
                                throw 'No skill category is found';

                            let loadSkillCategoriesResult = loadSkillCategoriesResponse.data;
                            if (!loadSkillCategoriesResult)
                                throw 'No skill category is found';

                            return loadSkillCategoriesResult;
                        });
                },

                /*
                * Edit skill category by using specific information.
                * */
                editSkillCategory(id, userId, photo, name) {
                    // Initialize model to submit api.
                    let model = {
                        userId: userId,
                        photo: photo,
                        name: name
                    };

                    return axios
                        .put(`${baseUrl}/api/skill-category/${id}`, model)
                        .then((editSkillCategoryResponse) => {
                            if (!editSkillCategoryResponse)
                                throw 'Failed to edit skill category';
                            return editSkillCategoryResponse.data;
                        });
                },

                /*
                * Add hobby.
                * */
                loadSkillCategorySkillRelationships(skillCategoryIds, userIds, names) {
                    // Build model to submit api end-point.
                    let condition = {
                        skillCategoryIds: skillCategoryIds,
                        userIds: userIds,
                        names: names
                    };

                    return axios
                        .post(`${baseUrl}/api/skill-category-skill/search`, condition)
                        .then((loadSkillCategorySkillRelationshipResponse) => {
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
                addSkillCategorySkillRelationship(id, userId, photo, name){

                    // Initialize model to submit to server.
                    let model = {
                        id: id,
                        userId: userId,
                        photo: photo,
                        name: name
                    };

                    return axios
                        .post(`${baseUrl}/api/skill-category-skill`, model)
                        .then((addSkillCategorySkillResponse) => {
                            if (!addSkillCategorySkillResponse)
                                throw 'Failed to add skill-category-skill relationship.';

                            return addSkillCategorySkillResponse.data;
                        });
                },

                /*
                * Edit skill category - skill relationship.
                * */
                editSkillCategorySkillRelationship(skillCategoryId, skillId, point) {
                    // Initialize model to submit to api end-point.
                    let model = {
                        point: point
                    };

                    return axios
                        .put(`${baseUrl}/api/skill-category-skill?skillCategoryId=${skillCategoryId}&skillId=${skillId}`, model)
                        .then((editSkillCategorySkillRelationshipResponse) => {
                            if (!editSkillCategorySkillRelationshipResponse)
                                throw 'Failed to edit skill-category-skill relationship.';

                            return editSkillCategorySkillRelationshipResponse.data;
                        });
                },

                /*
                * Edit user using specific condition.
                * */
                loadSkills(ids, names, createdTime) {
                    let conditions = {
                        ids: ids,
                        names: names,
                        createdTime: createdTime
                    };

                    return axios
                        .post(`${baseUrl}/api/skill/search`, conditions)
                        .then((loadSkillsResponse) => {
                            if (!loadSkillsResponse)
                                throw 'No skill is found';
                            return loadSkillsResponse.data;
                        });
                }

                //#endregion
            }
        });
</script>
