<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$skill', ['baseUrl'], (baseUrl) => {
            return {

                /*
                * Get users by using specific conditions.
                * */
                getSkills(condition) {
                    return axios
                        .post(`${baseUrl}/api/skill/search`, condition)
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
                addSkill(skill) {
                    return axios
                        .post(`${baseUrl}/api/skill`, skill)
                        .then((addSkillResponse) => {
                            if (!addSkillResponse)
                                throw 'Failed to add skill';

                            let addSkillResult = addSkillResponse.data;
                            if (!addSkillResult)
                                throw 'Failed to add skill';

                            return addSkillResult;
                        });
                },

                /*
                * Edit user using specific condition.
                * */
                editSkill(id, skill) {
                    return axios
                        .put(`${baseUrl}/api/skill/${id}`, skill)
                        .then((editSkillResponse) => {
                            if (!editSkillResponse)
                                throw 'Failed to add edit skill';

                            return editSkillResponse.data;
                        });
                },

                /*
                * Find and delete user.
                * */
                deleteSkill(id){
                    return axios
                        .delete(`${baseUrl}/api/skil/${id}`)
                        .then((deleteSkillResponse) => {
                            if (!deleteUserResponse)
                                throw 'Cannot delete skill detail';
                            return deleteSkillResponse.data;
                        });
                }
            }
        });
</script>
