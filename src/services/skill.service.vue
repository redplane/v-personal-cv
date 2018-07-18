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
                addSkillCategory(userId, photo, name) {
                    // Initialize model to submit api.
                    let fd = new FormData();
                    fd.append('userId', userId);
                    fd.append('photo', photo);
                    fd.append('name', name);

                    let headers = {
                        'Content-Type': null
                    };

                    return axios
                        .post(`${baseUrl}/api/skill-category`, fd, headers)
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
                * Add skills to a specific category.
                * */
                addSkillsToCategory(skillCategoryId, skillIds){
                    // Initialize model to submit api.
                    let model = {
                        skillCategoryId: skillCategoryId,
                        skillIds: skillIds
                    };

                    return axios
                        .post(`${baseUrl}/api/skill-category-skill`, model)
                        .then((addSkillCategoriesResponse) => {
                            if (!addSkillCategoriesResponse)
                                throw 'Failed to add skills to skill category';
                            return addSkillCategoriesResponse.data;
                        });
                },

                /*
                * Edit skill category by using specific information.
                * */
                editSkillCategory(id, userId, photo, name) {
                    // Initialize model to submit api.
                    let fd = new FormData();
                    fd.append('userId', userId);
                    fd.append('photo', photo);
                    fd.append('name', name);

                    return axios
                        .put(`${baseUrl}/api/skill-category/${id}`, fd)
                        .then((editSkillCategoryResponse) => {
                            if (!editSkillCategoryResponse)
                                throw 'Failed to edit skill category';
                            return editSkillCategoryResponse.data;
                        });
                },

                /*
                * Add hobby.
                * */
                loadSkillCategorySkillRelationships(skillCategoryIds, skillIds, page, records) {
                    // Build model to submit api end-point.
                    let condition = {
                        skillCategoryIds: skillCategoryIds,
                        skillIds: skillIds
                    };

                    if (page || records){
                        let pagination = condition['pagination'] = {};
                        pagination['page'] = page;
                        pagination['records'] = records;
                    }

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
                loadSkills(ids, names, createdTime, page, records) {
                    let conditions = {
                        ids: ids,
                        names: names,
                        createdTime: createdTime,
                        pagination: {
                            page: page,
                            records: records
                        }
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
