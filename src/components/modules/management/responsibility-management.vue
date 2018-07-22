<template>
    <div>

        <!--Responsibilities list-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <table class="table table-condensed table-responsive">
                        <thead>
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Created time</th>
                            <th class="text-center">Last modified time</th>
                            <th v-if="bIsUserAdmin"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="responsibilities && responsibilities.length"
                            v-for="responsibility in responsibilities">
                            <td class="text-center">{{responsibility.name}}</td>
                            <td class="text-center">{{responsibility.createdTime}}</td>
                            <td class="text-center">{{responsibility.lastModifiedTime}}</td>
                            <td class="text-center"
                                v-if="bIsUserAdmin">
                                <button class="btn btn-info"
                                        v-on:click="vOnEditResponsibilityClicked(responsibility)">
                                    <i class="glyphicon glyphicon-pencil"></i>
                                </button>
                                <span>&nbsp;</span>
                                <button class="btn btn-danger"
                                        v-on:click="vOnDeleteResponsibilityClick(responsibility)">
                                    <i class="glyphicon glyphicon-remove"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!responsibilities || !responsibilities.length">
                            <td colspan="4"
                                class="text-center">
                                <i class="text-danger">No information is available.</i>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4">
                                <div class="pull-right">
                                    <button class="btn btn-primary"
                                            v-on:click="vOnAddResponsibilityClicked()">
                                        <i class="glyphicon glyphicon-plus"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <pagination v-model="loadResponsibilitiesCondition.pagination.page"
                                :total-page="loadResponsibilitiesResult.total"
                                align="center"
                                :boundary-links="true"
                                :direction-links="true"
                                @change="vOnLoadResponsibilityPageChange($event)">
                    </pagination>
                </div>
            </div>
        </div>

        <!--Edit/add responsibility modal-->
        <modal :header="false"
               :footer="false"
               v-model="bIsResponsibilityDetailModalOpened"
               v-if="bIsResponsibilityDetailModalOpened"
               size="md"
               class="replace-body">
            <div slot="default">
                <responsibility-detail :responsibility-property="responsibility"
                                       v-on:confirm="addEditResponsibility($event)"
                                       v-on:cancel="bIsResponsibilityDetailModalOpened = false"/>
            </div>
        </modal>

        <!--Delete responsibility modal-->
        <modal :header="false"
               v-model="bIsDeleteResponsibilityModalOpened"
               v-if="bIsDeleteResponsibilityModalOpened"
               size="md">
            <div slot="default">
                <div class="text-center">
                    <span class="text-danger">Are you sure to delete <b>{{responsibility.name}}</b> from the system ?</span>
                </div>
            </div>
            <div slot="footer">
                <div class="text-center">
                    <button class="btn btn-danger"
                            v-on:click="deleteResponsibility(responsibility.id)">
                        <span>OK</span>
                    </button>
                    <span>&nbsp;</span>
                    <button class="btn btn-default"
                            @click="bIsDeleteResponsibilityModalOpened = false">Cancel</button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

    // Import responsibility detail component.
    import ResponsibilityDetail from '../responsibility/responsibility-detail';
    import { mapMutations } from 'vuex';

    export default {
        name: 'responsibility-dashboard',
        dependencies: ['$responsibility', '$toastr', 'userRoleConstant', 'paginationConstant'],
        data() {
            return {

                /*
                * Load responsibilities result.
                * */
                loadResponsibilitiesResult: {
                    records: [],
                    total: 0
                },

                /*
                * Load responsibilities condition.
                * */
                loadResponsibilitiesCondition:{
                    pagination:{
                        page: 1,
                        records: this.paginationConstant.dashboardMaxItem
                    }
                },

                responsibility: {},
                bIsResponsibilityDetailModalOpened: false,
                bIsDeleteResponsibilityModalOpened: false
            }
        },
        computed:{
            /*
            * Profile information.
            * */
            profile(){
                return this.$store.getters.profile;
            },

            /*
              * Check whether user is admin.
              * */
            bIsUserAdmin(){
                if (!this.profile)
                    return;

                return this.profile.role === this.userRoleConstant.admin;
            },

            /*
            * List of responsibilities that loaded from api end-point.
            * */
            responsibilities(){
                if (!this.loadResponsibilitiesResult || !this.loadResponsibilitiesResult.records || this.loadResponsibilitiesResult.total < 1)
                    return [];

                return this.loadResponsibilitiesResult.records;
            }
        },
        mounted() {

            // Get context.
            let self = this;

            // Load responsibilities.
            this.addLoadingScreen();

            self.loadResponsibilities()
                .catch(() => {
                    return {
                        records: [],
                        total: 0
                    }
                })
                .then((loadResponsibilitiesResult) => {
                    self.loadResponsibilitiesResult = loadResponsibilitiesResult;
                    self.deleteLoadingScreen();
                })

        },
        methods: {
            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Called when edit responsibility is selected to be edited.
            * */
            vOnEditResponsibilityClicked(responsibility) {
                this.responsibility = responsibility;
                this.bIsResponsibilityDetailModalOpened = true;
            },

            /*
            * Called when responsibility is added.
            * */
            vOnAddResponsibilityClicked() {
                this.responsibility = {};
                this.bIsResponsibilityDetailModalOpened = true;
            },

            /*
            * Called when delete responsibility button is clicked.
            * */
            vOnDeleteResponsibilityClick(responsibility) {
                this.responsibility = responsibility;
                this.bIsDeleteResponsibilityModalOpened = true;
            },

            /*
            * Add responsibility using specific conditions.
            * */
            addEditResponsibility($event) {
                // Declare promise to resolve.
                let pAddEditPromise = null;
                let responsibility = $event;

                // Get current context.
                let self = this;
                if (!responsibility.id) {

                    pAddEditPromise = this.$responsibility
                        .addResponsibility(responsibility)
                        .then(() => {
                            self.$toastr.success('Added responsibility to system.');
                        });
                } else {
                    pAddEditPromise = this.$responsibility
                        .editResponsibility(responsibility.id, responsibility)
                        .then(() => {
                            self.$toastr.success('Responsibility has been edited.');
                        });
                }

                pAddEditPromise
                    .then(() => {
                        self.bIsResponsibilityDetailModalOpened = false;
                    });
            },

            /*
            * Delete responsibility by searching for its id.
            * */
            deleteResponsibility(id){
                // Get context.
                let self = this;

                // Block app UI.
                self.addLoadingScreen();

                this.$responsibility
                    .deleteResponsibility(id)
                    .then(() => {
                        self.$toastr.success('Responsibility has been delete from the system successfully.');

                        // Close modal dialog.
                        self.bIsDeleteResponsibilityModalOpened = false;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Load responsibilities using global search condition.
            * */
            loadResponsibilities(){
                return this.$responsibility
                    .loadResponsibilities();
            },

            /*
            * Called when responsibilities result is loaded.
            * */
            vOnLoadResponsibilityPageChange(){
                let self = this;

                // Add loading screen.
                self.addLoadingScreen();

                self.loadResponsibilities()
                    .then((loadResponsibilitiesResult) => {
                        self.loadResponsibilitiesResult = loadResponsibilitiesResult;
                    })
                    .finally(() => {
                        self.deleteLoadingScreen();
                    });
            }
        },
        components: {
            ResponsibilityDetail
        }
    }
</script>

<style scoped>

</style>