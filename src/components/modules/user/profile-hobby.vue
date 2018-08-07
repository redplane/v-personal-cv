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
                        <li @click="vOnAddUserHobbyClicked()">
                            <a href="javascript:void(0);">Add hobby</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="panel-body">

                <!--User descriptions-->
                <div class="form-group">
                    <table class="table table-condensed table-striped">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Description</th>
                            <th class="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="hobby in hobbies">
                            <td class="text-center">{{hobby.name}}</td>
                            <td class="text-center">{{hobby.description}}</td>
                            <td class="text-center">
                                <button class="btn btn-info"
                                        @click="vOnEditHobbyClicked(hobby)">
                                    <span class="fa fa-edit"></span>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-danger"
                                        @click="vOnDeleteHobbyClicked(hobby)">
                                    <span class="fa fa-trash"></span>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <!--Pagination-->
                <div class="form-group">
                    <div class="text-center">
                        <div class="form-group">
                            <pagination v-model="loadUserHobbiesCondition.pagination.page"
                                        :total-page="totalPage"
                                        :boundary-links="true"
                                        size="sm"
                                        @change="vOnPaginationChange()">
                            </pagination>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!--Add/edit user hobby-->
        <modal :header="false"
               :footer="false"
               v-if="bIsAddEditUserHobbyModalAvailable"
               v-model="bIsAddEditUserHobbyModalAvailable"
               class="replace-body">
            <div slot="default">
                <user-hobby-detail :user-hobby-detail-property="oSelectedUserHobby"
                                   @cancel="bIsAddEditUserHobbyModalAvailable = false"
                                   @ok="addEditUserHobby"></user-hobby-detail>
            </div>
        </modal>

        <!--Delete user hobby-->
        <modal v-if="bIsDeleteUserHobbyModalAvailable"
               v-model="bIsDeleteUserHobbyModalAvailable"
               class="replace-body">
            <div slot="header">
                <b>Delete user hobby confirmation</b>
            </div>
            <div slot="default">
                <div class="text-center">
                    <b class="text-danger">Are you sure to delete this hobby ?</b>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            @click="deleteUserHobby(oSelectedUserHobby)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="bIsDeleteUserHobbyModalAvailable = false">
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

    import {mapMutations, mapGetters} from 'vuex';
    import UserHobbyDetail from './user-hobby-detail';

    export default {
        name: 'profile-hobby',
        dependencies: ['paginationConstant', '$user', '$ui', '$hobby', '$toastr'],
        components: {UserHobbyDetail},
        props: {
            userIdProperty: null
        },
        computed: {
            /*
            * Get hobbies list.
            * */
            hobbies() {
                let self = this;
                if (!self.loadUserHobbiesResult)
                    return [];

                return self.loadUserHobbiesResult.records;
            },
            totalPage() {
                let self = this;
                let iPage = self.$ui.loadPageCalculation(self.loadUserHobbiesResult.total, self.loadUserHobbiesCondition.pagination.records);
                return iPage;
            }
        },
        data() {
            return {
                userId: null,

                /*
                * Load user hobby condition.
                * */
                loadUserHobbiesCondition: {
                    userIds: [],
                    pagination: {
                        page: 1,
                        records: this.paginationConstant.dashboardMaxItem
                    }
                },

                /*
                * Load user hobbies result.
                * */
                loadUserHobbiesResult: {
                    records: [],
                    total: 0
                },

                /*
                * Whether add/edit user hobby is available or not.
                * */
                bIsAddEditUserHobbyModalAvailable: false,

                /*
                * Whether delete hobby is available or not.
                * */
                bIsDeleteUserHobbyModalAvailable: false,

                /*
                * The selected user hobby for edit.
                * */
                oSelectedUserHobby: null
            }
        },
        methods: {

            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Load user hobbies using defined condition.
            * */
            _loadUserHobbies() {
                let self = this;
                return self.$hobby
                    .loadUserHobbies(self.loadUserHobbiesCondition);
            },

            /*
            * Called when add hobby is clicked.
            * */
            vOnAddUserHobbyClicked() {
                let self = this;
                self.oSelectedUserHobby = {};
                self.bIsAddEditUserHobbyModalAvailable = true;
            },

            /*
            * On edit hobby clicked.
            * */
            vOnEditHobbyClicked(userHobby) {
                let self = this;
                self.oSelectedUserHobby = userHobby;
                self.bIsAddEditUserHobbyModalAvailable = true;
            },

            /*
            * On hobby is selected to be deleted.
            * */
            vOnDeleteHobbyClicked(userHobby) {
                let self = this;
                self.oSelectedUserHobby = userHobby;
                self.bIsDeleteUserHobbyModalAvailable = true;
            },

            /*
            * Called when pagination changed.
            * */
            vOnPaginationChange() {

                // Get current context.
                let self = this;

                // Add loading screen.
                self.addLoadingScreen();

                self._loadUserHobbies()
                    .then((loadUserHobbiesResult) => {
                        self.loadUserHobbiesResult = loadUserHobbiesResult;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when user hobby is confirmed being edied.
            * */
            addEditUserHobby(userHobby) {
                if (!userHobby)
                    return;

                // Get current context.
                let self = this;

                // Block screen access.
                self.addLoadingScreen();

                let pPromise = null;

                if (userHobby.id) {
                    pPromise = self
                        .$hobby
                        .editHobby(userHobby.id, userHobby)
                        .then(() => {
                            // Display the toastr notification.
                            self.$toastr.success('Hobby has been added successfully.')
                        });
                } else {
                    let pUserHobby = Object.assign({}, userHobby);
                    pUserHobby['userId'] = self.userId;

                    pPromise = self
                        .$hobby
                        .addUserHobby(pUserHobby)
                        .then(() => {
                            // Display the toastr notification.
                            self.$toastr.success('Hobby has been added successfully.')
                        });
                }

                pPromise
                    .then(() => {
                        self.bIsAddEditUserHobbyModalAvailable = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when delete hobby is confirmed.
            * */
            deleteUserHobby(userHobby) {
                // No hobby is selected
                if (!userHobby || !userHobby.id)
                    return;

                let self = this;

                // Add loading screen.
                self.addLoadingScreen();

                self.$hobby
                    .deleteHobby(userHobby.id)
                    .then(() => {
                        // Display success message.
                        self.$toastr.success('Hobby has been deleted successfully.');

                        // Close modal.
                        self.bIsDeleteUserHobbyModalAvailable = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            }
        },
        mounted() {

            // Get current context.
            let self = this;

            //#region Load hobbies

            // Add loading screen.
            self.addLoadingScreen();

            let loadUserIdPromise = new Promise(resolve => {
                resolve(self.userIdProperty);
            });

            loadUserIdPromise
                .then((userId) => {
                    self.userId = userId;
                    self.loadUserHobbiesCondition.userIds = [userId];

                    return self._loadUserHobbies();
                })
                .then((loadUserHobbiesResult) => {
                    self.loadUserHobbiesResult = loadUserHobbiesResult;
                })
                .finally(() => {
                    self.deleteLoadingScreen();
                })

            //#endregion
        }
    }
</script>

<style scoped>

</style>