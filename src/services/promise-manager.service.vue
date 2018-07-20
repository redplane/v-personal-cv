<template>
    
</template>

<script>
    const injector = require('vue-inject/dist/vue-inject');

    injector
        .service('$promiseManager', () => {

            //#region Properties

            // List of registered promises.
            let _promises = {};

            let service = {

                //#region Methods

                /*
                * Map promise and its canceller to cache.
                * */
                addPromise: (promise, canceller) => {

                    // Promise is already in list.
                    if (_promises[promise]) {
                        return;
                    }

                    _promises[promise] = canceller;
                },

                /*
                * Delete promise from list.
                * */
                deletePromise: (promise) => {

                    // Promise is not in list.
                    if (!_promises[promise])
                        return;

                    delete _promises[promise];
                },

                /*
                * Cancel and remove promise from cache.
                * */
                cancelPromise: (promise) => {
                    if (!_promises[promise])
                        return;

                    let canceller = _promises[promise];
                    try{
                        canceller.cancel();
                    } catch{

                    }

                    service.deletePromise(promise);
                }

                //#endregion
            };

            //#endregion

            return service;
        });
</script>

<style scoped>

</style>