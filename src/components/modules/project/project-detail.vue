<template>

    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title">Project detail</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-lg-3">
                    <label>Name</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <input class="form-control"/>
                    </div>
                </div>
            </div>

            <!--Time (from)-->
            <div class="row">
                <div class="col-lg-3">
                    <label>From</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <div class="form-control"></div>
                    </div>
                </div>
            </div>

            <!--Time (to)-->
            <div class="row">
                <div class="col-lg-3">
                    <label>To</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <div class="form-control"></div>
                    </div>
                </div>
            </div>

            <!--Responsibilities-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Responsibilities</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <div class="form-control">
                            <ul>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!--Skills-->
            <div class="row">
                <div class="col-lg-3">
                    <label>Skills</label>
                </div>
                <div class="col-lg-9">
                    <div class="form-group">
                        <div class="form-control">
                            <ul>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'project-detail',
        props: {
            projectProperty: null
        },
        data() {
            return {
                project: {}
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>