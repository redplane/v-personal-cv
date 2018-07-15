<script>
    const injector = require('vue-inject/dist/vue-inject');
    const _ = require('lodash/core');
    injector
        .service('$lodash', null, ()=> {
            return _;
        });
</script>
