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
                        .then((addUserResponse) => {
                            if (!addUserResponse)
                                throw 'No user has been found';

                            let user = addUserResponse.data;
                            if (!user)
                                throw 'No user has been found';

                            return user;
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
                        });
                },

                /*
                * Find and delete user.
                * */
                deleteUser(id){
                    return axios
                        .delete(`${baseUrl}/api/user/${id}`)
                        .then((deleteUserResponse) => {
                            if (!deleteUserResponse)
                                throw 'Cannot delete user detail';
                            return deleteUserResponse.data;
                        });
                }
            }
        });
</script>
