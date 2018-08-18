<script>
    const injector = require('vue-inject/dist/vue-inject');
    injector
        .service('$project', ['baseUrl', '$axios'], (baseUrl, $axios) => {
            return {
                //#region Methods

                /*
                * Get projects by using specific conditions.
                * */
                loadProjects(conditions) {
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
                addProject(userId, name, description, startedTime, finishedTime, skillIds, responsibilityIds) {
                    let model = {
                        userId: userId,
                        name: name,
                        description: description,
                        startedTime: startedTime,
                        finishedTime: finishedTime,
                        skillIds: skillIds,
                        responsibilityIds: responsibilityIds
                    };

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
                editProject(id, userId, name, description, startedTime, finishedTime, skillIds, responsibilityIds) {
                    let model = {
                        userId: userId,
                        name: name,
                        description: description,
                        startedTime: startedTime,
                        finishedTime: finishedTime,
                        skillIds: skillIds,
                        responsibilityIds: responsibilityIds
                    };

                    return $axios
                        .put(`${baseUrl}/api/project/${id}`, model)
                        .then((addProjectResponse) => {
                            if (!addProjectResponse)
                                throw 'Failed to add project';

                            return addProjectResponse.data;
                        });
                },

                /*
                * Delete user project
                * */
                deleteProject(id){
                    return $axios
                        .delete(`${baseUrl}/api/project/${id}`)
                        .then((deleteProjectResponse) => {
                            if (!deleteProjectResponse)
                                throw 'Failed to delete project';

                            return true;
                        });
                },

                /*
                * Load project responsibilities by using specific conditions.
                * */
                loadProjectResponsibilityRelationships(projectIds, responsibilityIds, createdTime, pagination) {
                    let condition = {
                        projectIds: projectIds,
                        responsibilityIds: responsibilityIds,
                        createdTime: createdTime,
                        pagination: pagination
                    };

                    return $axios
                        .post(`${baseUrl}/api/project-responsibility/search`, condition)
                        .then((loadProjectResponsibilityResponse) => {
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
                addProjectResponsibilityRelationship(projectId, responsibilityId) {
                    let model = {
                        projectId: projectId,
                        responsibilityId: responsibilityId
                    };

                    return $axios
                        .post(`${baseUrl}/api/project-responsibility`, model)
                        .then((addProjectResponsibilityResponse) => {
                            if (!addProjectResponsibilityResponse)
                                throw 'Failed to add project responsibility';

                            return addProjectResponsibilityResponse.data;
                        });

                },

                /*
                * Load project skill relationships.
                * */
                loadProjectSkillRelationships(projectIds, skillIds, page, records) {
                    let condition = {
                        projectIds: projectIds,
                        skillIds: skillIds,
                        pagination: {
                            page: page,
                            records: records
                        }
                    };

                    return $axios
                        .post(`${baseUrl}/api/project-skill/search`, condition)
                        .then((loadProjectSkillRelationshipsResponse) => {
                            if (!loadProjectSkillRelationshipsResponse)
                                throw 'No project skill is found';

                            let loadProjectSkillRelationshipsResult = loadProjectSkillRelationshipsResponse.data;
                            if (!loadProjectSkillRelationshipsResult)
                                throw 'No project skill is found';

                            return loadProjectSkillRelationshipsResult;
                        });
                }

                //#endregion
            }
        });
</script>
