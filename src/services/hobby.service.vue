<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$hobby', ['baseUrl'], (baseUrl) => {
            return {

                /*
                * Get hobbies by using specific conditions.
                * */
                loadUserHobbies(condition) {
                    return axios
                        .post(`${baseUrl}/api/hobby/search`, condition)
                        .then((loadHobbiesResponse) => {
                            if (!loadHobbiesResponse)
                                throw 'No hobby is found';

                            let loadHobbiesResult = loadHobbiesResponse.data;
                            if (!loadHobbiesResult)
                                throw 'No hobby is found';

                            return loadHobbiesResult;
                        });
                },

                /*
                * Add hobby.
                * */
                addUserHobby(hobby) {
                    return axios
                        .post(`${baseUrl}/api/hobby`, hobby)
                        .then((addHobbyResponse) => {
                            if (!addHobbyResponse)
                                throw 'Failed to add hobby';

                            let hobby = addHobbyResponse.data;
                            if (!hobby)
                                throw 'Failed to add user description';

                            return hobby;
                        });
                },

                /*
                * Edit user using specific condition.
                * */
                editHobby(id, hobby) {
                    return axios
                        .put(`${baseUrl}/api/hobby/${id}`, hobby)
                        .then((editHobbyResponse) => {
                            if (!editHobbyResponse)
                                throw 'Cannot edit hobby';

                            return editHobbyResponse.data;
                        });
                },

                /*
                * Find and delete user.
                * */
                deleteHobby(id){
                    return axios
                        .delete(`${baseUrl}/api/hobby/${id}`)
                        .then((deleteHobbyResponse) => {
                            if (!deleteHobbyResponse)
                                throw 'Cannot delete hobby';
                            return deleteHobbyResponse.data;
                        });
                }
            }
        });
</script>
