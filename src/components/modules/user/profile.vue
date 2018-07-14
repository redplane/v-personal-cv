<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading"><h3 class="panel-title">About me</h3></div>
                    <div class="panel-body">
                        <ul v-if="user && user.descriptions">
                            <li v-for="item in user.descriptions" class="alert alert-info"> {{item.description}}</li>
                        </ul>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading"><h3 class="panel-title">My hobbies</h3></div>
                    <div class="panel-body">
                        <div v-if="user && user.hobbies"
                             v-for="hobby in user.hobbies">
                            <div class="row">
                                <div class="col-lg-3">
                                    <label>{{hobby.name}}</label>
                                </div>
                                <div class="col-lg-9">
                                    <div class="form-group">{{hobby.description}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <tabs>
                        <tab title="Project I have done"></tab>
                        <tab title="Techniques I have used"></tab>
                    </tabs>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
                        Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan
                        four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
                        beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda
                        labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit
                        sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean
                        shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown,
                        tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    export default {
        name: 'profile',
        dependencies: ['$userDescription', '$hobby', '$toastr'],
        data() {
            return {
                user: {
                    descriptions: [],
                    hobbies: [],
                    projects: [],
                    skills: []
                }
            }
        },
        computed: {},
        mounted() {

            // Get params in route.
            let params = this.$route.params;
            let userId = parseInt(params.id);
            let self = this;

            // List of promises that needs resolving.
            let pLoadInitialDataPromise = [];

            //#region Load user hobbies

            let loadUserHobbiesCondition = {
                userIds: [userId]
            };

            let pLoadHobbiesPromise = this.$hobby
                .loadUserHobbies(loadUserHobbiesCondition)
                .then((loadUserHobbiesResult) => {
                    self.user.hobbies = loadUserHobbiesResult.records;
                    console.log(loadUserHobbiesResult);
                })
                .catch(() => {
                    self.user.hobbies = []
                });

            pLoadInitialDataPromise.push(pLoadHobbiesPromise);

            //#endregion

            //#region Load user descriptions

            let loadUserDescriptionsCondition = {
                userIds: [userId]
            };

            let pLoadUserDescriptionsPromise = this.$userDescription
                .loadUserDescriptions(loadUserDescriptionsCondition)
                .then((loadUserDescriptionsResult) => {
                    self.user.descriptions = loadUserDescriptionsResult.records;
                });

            pLoadInitialDataPromise.push(pLoadUserDescriptionsPromise);

            //#endregion

            Promise.all(pLoadInitialDataPromise)
                .then(() => {
                    self.$toastr.success('User data has been loaded successfully.');
                });
        }
    }
</script>

<style scoped>

</style>