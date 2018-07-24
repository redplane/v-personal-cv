<template>
    <div>
        <div class="panel panel-info">

            <div class="panel-heading clearfix">
                <div class="btn-group pull-right" role="group">
                    <button type="button"
                            class="btn btn-info dropdown-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                        <span class="fa fa-bars"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="javascript:void(0);">Add hobby</a></li>
                    </ul>
                </div>
            </div>

            <div class="panel-body">
                <table class="table table-condensed table-striped">
                    <thead>
                    <tr>
                        <th class="text-center">Name</th>
                        <th class="text-center">Description</th>
                        <th class="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "user-hobby"
    }
</script>

<style scoped>

</style>