<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios').default;

    injector
        .service('$user', ['baseUrl'], (baseUrl) => {
            return {

                /*
                * Get users by using specific conditions.
                * */
                getUser() {
                    return axios
                        .post(`${baseUrl}/api/user/search`, {})
                        .then((loadUserResponse) => {
                            if (!loadUserResponse)
                                throw 'No user has been found';

                            let loadUserResult = loadUserResponse.data;
                            if (!loadUserResult)
                                throw 'No user has been found';

                            return loadUserResult;
                        });
                },

                /*
                * Add user using specific conditions.
                * */
                addUser(user) {
                    return axios
                        .post(`${baseUrl}/api/user`, user)
                        .then((loadUserResponse) => {
                            if (!loadUserResponse)
                                throw 'No user has been found';

                            let loadUserResult = loadUserResponse.data;
                            if (!loadUserResult)
                                throw 'No user has been found';

                            return loadUserResult;
                        });
                },

                /*
                * Edit user using specific condition.
                * */
                editUser(id, user) {
                    return axios
                        .put(`${baseUrl}/api/user/${id}`, user)
                        .then((editUserResponse) => {
                            if (!editUserResponse)
                                throw 'Cannot edit user detail';

                            return editUserResponse.data;
                        })
                }
            }
        });
</script>
