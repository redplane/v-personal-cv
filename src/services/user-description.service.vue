<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$userDescription', ['baseUrl'], (baseUrl) => {
            return {

                /*
                * Get users by using specific conditions.
                * */
                loadUserDescriptions(condition) {
                    return axios
                        .post(`${baseUrl}/api/user-description/search`, condition)
                        .then((loadUserDescriptionResponse) => {
                            if (!loadUserDescriptionResponse)
                                throw 'No description is found';

                            let loadUserDescriptionResult = loadUserDescriptionResponse.data;
                            if (!loadUserDescriptionResult)
                                throw 'No description is found';

                            return loadUserDescriptionResult;
                        });
                },

                /*
                * Add user using specific conditions.
                * */
                addUserDescription(userDescription) {
                    return axios
                        .post(`${baseUrl}/api/user-description`, userDescription)
                        .then((addUserDescriptionResponse) => {
                            if (!addUserDescriptionResponse)
                                throw 'Failed to add user description';

                            let userDescription = addUserDescriptionResponse.data;
                            if (!userDescription)
                                throw 'Failed to add user description';

                            return userDescription;
                        });
                },

                /*
                * Edit user using specific condition.
                * */
                editUserDescription(id, userDescription) {
                    return axios
                        .put(`${baseUrl}/api/user-description/${id}`, userDescription)
                        .then((editUserDescriptionResponse) => {
                            if (!editUserDescriptionResponse)
                                throw 'Cannot edit user detail';

                            return editUserDescriptionResponse.data;
                        });
                },

                /*
                * Find and delete user.
                * */
                deleteUserDescription(id){
                    return axios
                        .delete(`${baseUrl}/api/user-description/${id}`)
                        .then((deleteUserDescriptionResponse) => {
                            if (!deleteUserDescriptionResponse)
                                throw 'Cannot delete user description';
                            return deleteUserDescriptionResponse.data;
                        });
                }
            }
        });
</script>
