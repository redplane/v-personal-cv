<script>
    const injector = require('vue-inject/dist/vue-inject');

    injector
        .service('$skill', ['baseUrl', '$promiseManager', '$axios'], (baseUrl, $promiseManager, $axios) => {
            return {
                //#region Methods

                /*
                * Get hobbies by using specific conditions.
                * */
                loadSkillCategories(condition) {
                    return $axios
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

                    return $axios
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
                addSkillsToCategory(skillCategoryId, skillIds) {
                    // Initialize model to submit api.
                    let model = {
                        skillCategoryId: skillCategoryId,
                        skillIds: skillIds
                    };

                    return $axios
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

                    return this,$axios
                        .put(`${baseUrl}/api/skill-category/${id}`, fd)
                        .then((editSkillCategoryResponse) => {
                            if (!editSkillCategoryResponse)
                                throw 'Failed to edit skill category';
                            return editSkillCategoryResponse.data;
                        });
                },

                /*
                * Add skill to the system.
                * */
                addSkill(name) {
                    // Initialize model to submit to end-point.
                    let model = {
                        name: name
                    };

                    let promise = $axios
                        .post(`${baseUrl}/api/skill`, model);

                    return promise
                        .then((editSkillCategoryResponse) => {
                            if (!editSkillCategoryResponse)
                                throw 'Failed to edit skill category';
                            return editSkillCategoryResponse.data;
                        });
                },

                /*
                * Edit skill by searching for its id.
                * */
                editSkill(id, name) {

                    // Initialize model to submit to end-point.
                    let model = {
                        name: name
                    };
                    return $axios
                        .put(`${baseUrl}/api/skill/${id}`, model)
                        .then((editSkillCategoryResponse) => {
                            if (!editSkillCategoryResponse)
                                throw 'Failed to edit skill category';
                            return editSkillCategoryResponse.data;
                        });
                },

                /*
                * Delete a skill by using specific id.
                * */
                deleteSkill(id) {
                    return $axios
                        .delete(`${baseUrl}/api/skill/${id}`, null)
                        .then((editSkillCategoryResponse) => {
                            if (!editSkillCategoryResponse)
                                throw 'Failed to delete skill category';
                            return editSkillCategoryResponse.data;
                        });
                },

                /*
                * Add hobby.
                * */
                loadSkillCategorySkillRelationships(condition) {
                    return $axios
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
                addSkillCategorySkillRelationship(id, userId, photo, name) {

                    // Initialize model to submit to server.
                    let model = {
                        id: id,
                        userId: userId,
                        photo: photo,
                        name: name
                    };

                    return $axios
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

                    return $axios
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
                loadSkills(condition) {

                    return $axios
                        .post(`${baseUrl}/api/skill/search`, condition)
                        .then((loadSkillsResponse) => {
                            if (!loadSkillsResponse)
                                throw 'No skill is found';
                            return loadSkillsResponse.data;
                        });


                },

                /*
                * Load upload skill category photo.
                * */
                uploadSkillCategoryPhoto(skillCategoryId, file) {

                    // Initialize form data.
                    let formData = new FormData();
                    formData.append('photo', file);

                    return $axios
                        .put(`${baseUrl}/api/skill-category/photo/${skillCategoryId}`, formData)
                        .then((uploadSkillCategoryPhotoResponse) => {
                            if (!uploadSkillCategoryPhotoResponse)
                                throw 'Failed to upload skill category photo';
                            return uploadSkillCategoryPhotoResponse.data;
                        });
                },

                /*
                * Delete skill category - skill relationship using specific conditions.
                * */
                deleteSkillCategorySkillRelationship(condition){
                    return $axios
                        .delete(`${baseUrl}/api/skill-category-skill?skillCategoryId=${condition.skillCategoryId}&skillId=${condition.skillId}`)
                        .then((loadSkillsResponse) => {
                            if (!loadSkillsResponse)
                                throw 'No skill category - skill relationship is found';
                        });
                }

                //#endregion
            }
        });
</script>
