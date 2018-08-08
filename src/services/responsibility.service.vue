<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$responsibility', ['baseUrl'], (baseUrl) => {
            return {

                /*
                * Get users by using specific conditions.
                * */
                loadResponsibilities(conditions) {
                    return axios
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
                addResponsibility(responsibility) {
                    return axios
                        .post(`${baseUrl}/api/responsibility`, responsibility)
                        .then((addResponsibilityResponse) => {
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
                editResponsibility(id, responsibility) {
                    return axios
                        .put(`${baseUrl}/api/responsibility/${id}`, responsibility)
                        .then((editResponsibilityResponse) => {
                            if (!editResponsibilityResponse)
                                throw 'Failed to add edit responsibility';

                            return editResponsibilityResponse.data;
                        });
                },

                /*
                * Find and delete user.
                * */
                deleteResponsibility(id){
                    return axios
                        .delete(`${baseUrl}/api/responsibility/${id}`)
                        .then((deleteResponsibilityResponse) => {
                            if (!deleteResponsibilityResponse)
                                throw 'Cannot delete responsibility detail';
                            return deleteResponsibilityResponse.data;
                        });
                }
            }
        });
</script>
