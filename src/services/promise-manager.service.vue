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
                * Wrap a promise into cancellable promise.
                * */
                addCancellablePromise: (promise) => {

                    // Create deferred instance.
                    let deferred = $.Deferred();
                    let deferredPromise = deferred.promise();

                    // Construct a promise race.
                    let finalPromise = Promise.race([promise, deferredPromise]);

                    // Add promise to list.
                    service.cancelPromise(finalPromise);
                    _promises[finalPromise] = deferred;

                    return finalPromise;
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
                        if (canceller['cancel'])
                            canceller.cancel();
                        else
                            canceller.reject('MANUALLY_CANCELLED');
                    } catch (exception){
                        console.log(exception);
                    }

                    service.deletePromise(promise);
                }

                //#endregion
            };

            //#endregion

            return service;
        })
        .lifecycle.application();
</script>

<style scoped>

</style>