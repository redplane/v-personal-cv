<script>
    const injector = require('vue-inject/dist/vue-inject');

    injector
        .service('$file', () => {
            return {

                /*
                * Construct a file from blob.
                * */
                buildFile(data, type){

                    let blob = null;

                    try {
                        blob = new Blob([data], {type: type});
                    }
                    catch (e) {
                        // Old browser, need to use blob builder
                        window.BlobBuilder = window.BlobBuilder ||
                            window.WebKitBlobBuilder ||
                            window.MozBlobBuilder ||
                            window.MSBlobBuilder;
                        if (window.BlobBuilder) {
                            let bb = new BlobBuilder();
                            bb.append(data);
                            blob = bb.getBlob(type);
                        }
                    }

                    return blob;
                }
            }
        });
</script>
