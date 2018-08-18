<script>
    const injector = require('vue-inject/dist/vue-inject');

    injector
        .service('$user', ['baseUrl', '$axios'], (baseUrl, $axios) => {
            return {

                /*
                * Edit user using specific condition.
                * */
                loadProfile(id) {
                    return $axios
                        .get(`${baseUrl}/api/user/personal-profile/${id}`)
                        .then((loadProfileResponse) => {
                            if (!loadProfileResponse)
                                throw 'Cannot get user profile';

                            return loadProfileResponse.data;
                        });
                },

                /*
                * Get users by using specific conditions.
                * */
                loadUsers(conditions) {
                    return $axios
                        .post(`${baseUrl}/api/user/search`, conditions)
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
                    return $axios
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

                    let formData = new FormData();

                    if (user.firstName)
                        formData.append('firstName', user.firstName);


                    if (user.lastName)
                        formData.append('lastName', user.lastName);


                    if (user.birthday !== null && user.birthday !== undefined)
                        formData.append('birthday', user.birthday);


                    if (user.photo)
                        formData.append('photo', user.photo);

                    let options = {
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: [(data, headers) => {
                            return data
                        }]
                    };

                    let fullUrl = `${baseUrl}/api/user/${id}`;
                    return $axios
                        .put(fullUrl, formData, options)
                        .then((uploadUserProfileImageResponse) => {
                            if (!uploadUserProfileImageResponse)
                                throw 'Cannot edit user profile';
                            return uploadUserProfileImageResponse.data;
                        });
                },

                /*
                * Find and delete user.
                * */
                deleteUser(id) {
                    return $axios
                        .delete(`${baseUrl}/api/user/${id}`)
                        .then((deleteUserResponse) => {
                            if (!deleteUserResponse)
                                throw 'Cannot delete user detail';
                            return deleteUserResponse.data;
                        });
                },

                /*
                * Login using specific information.
                * */
                login(loginModel) {
                    return $axios
                        .post(`${baseUrl}/api/user/login`, loginModel)
                        .then((loginResponse) => {
                            if (!loginResponse)
                                throw 'Failed to sign user into system';
                            return loginResponse.data;
                        });
                },

                /*
                * Upload user profile image.
                * */
                uploadProfileImage(id, blob) {

                    let formData = new FormData();
                    formData.append('photo', blob);


                    let options = {
                        headers: {
                            'Content-Type': null
                        }
                    };

                    let fullUrl = `${baseUrl}/api/user/profile-image/${id}`;

                    return $.post({
                        url: fullUrl,
                        contentType: null,
                        data: formData,
                    })
                        .then((uploadUserProfileImageResponse) => {
                            if (!uploadUserProfileImageResponse)
                                throw 'Cannot upload user profile image';
                            return uploadUserProfileImageResponse.data;
                        });

                    // return $axios
                    //     .post(fullUrl, formData, options)
                    //     .then((uploadUserProfileImageResponse) => {
                    //         if (!uploadUserProfileImageResponse)
                    //             throw 'Cannot upload user profile image';
                    //         return uploadUserProfileImageResponse.data;
                    //     });
                },

            }
        });
</script>
