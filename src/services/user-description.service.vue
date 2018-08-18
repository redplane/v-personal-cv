<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$userDescription', ['baseUrl', '$axios'], (baseUrl, $axios) => {
            return {

                /*
                * Get users by using specific conditions.
                * */
                loadUserDescriptions(ids, userIds, page, records) {

                    // Build search condition.
                    let condition = {
                        ids: ids,
                        userIds: userIds,
                    };


                    if (page || records) {
                        let pagination = condition['pagination'] = {};
                        if (page)
                            pagination['page'] = page;

                        if (records)
                            pagination['records'] = records;
                    }

                    return $axios
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
                addUserDescription(userId, description) {

                    let model = {
                        userId: userId,
                        description: description
                    };

                    return $axios
                        .post(`${baseUrl}/api/user-description`, model)
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
                    return $axios
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
                    return $axios
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
