<script>
    const toastr = require('toastr');
    const injector = require('vue-inject/dist/vue-inject');
    injector
        .service('$toastr', () => {
            return toastr;
        });
</script>