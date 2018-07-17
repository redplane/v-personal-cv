<script>
    const injector = require('vue-inject/dist/vue-inject');
    injector
        .service('$localStorage', () => {
            return localStorage;
        });
</script>
