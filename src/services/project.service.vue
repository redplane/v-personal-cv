<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$project', ['baseUrl'], (baseUrl) => {
            return {
                //#region Methods

                /*
                * Get projects by using specific conditions.
                * */
                loadProjects(ids, userIds) {

                    // Construct search model.
                    let condition = {
                        ids: ids,
                        userIds: userIds
                    };

                    return axios
                        .post(`${baseUrl}/api/project/search`, condition)
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
                addProject(id, userId, name, description, startedTime, finishedTime) {
                    let model = {
                        id: id,
                        userId: userId,
                        name: name,
                        description: description,
                        startedTime: startedTime,
                        finishedTime: finishedTime
                    };

                    return axios
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
                editProject(id, userId, name, description, startedTime, finishedTime) {
                    let model = {
                        userId: userId,
                        name: name,
                        description: description,
                        startedTime: startedTime,
                        finishedTime: finishedTime
                    };

                    return axios
                        .put(`${baseUrl}/api/project/${id}`, model)
                        .then((addProjectResponse) => {
                            if (!addProjectResponse)
                                throw 'Failed to add project';

                            return addProjectResponse.data;
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

                    return axios
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

                    return axios
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

                    return axios
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
