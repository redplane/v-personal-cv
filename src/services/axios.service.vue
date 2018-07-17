<script>
    const injector = require('vue-inject/dist/vue-inject');
    const axios = require('axios');

    injector
        .service('$axios', ['lsAppAccessToken', '$localStorage'], (lsAppAccessToken, $localStorage) => {

            //#region Authentication interceptors.

            let instance = axios.create();
            instance.interceptors.request.use(pRequestConfig => {
                let accessToken = $localStorage.getItem('lsAppAccessToken');
                if (accessToken)
                    pRequestConfig.headers['Authorization'] = `Bearer ${accessToken}`;
                return pRequestConfig;
            });

            //#endregion

            return instance;
        });
</script>
