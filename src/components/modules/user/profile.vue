<template>
    <div>
        <!--General information-->
        <div class="row">
            <div class="col-lg-12">
                <div class="panel panel-default">
                    <div class="panel-heading"><h3 class="panel-title">About {{user.firstName}} {{user.lastName}}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="panel-default">
                                    <div class="panel-body text-center">
                                        <img class="img img-thumbnail"
                                             v-bind:src="user.photo"/>
                                    </div>
                                    <div class="panel-footer text-center">
                                        <button class="btn btn-info">
                                            <span class="fa fa-camera"></span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div class="col-lg-9">
                                <ul v-if="user && user.descriptions">
                                    <li v-for="item in user.descriptions" class="alert alert-info">
                                        {{item.description}}
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)" @click="vOnAddUserDescriptionClick">Add
                                            description</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading"><h3 class="panel-title">My hobbies</h3></div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-12">
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
            </div>
        </div>

        <!--Tabs panel-->
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <ul class="nav nav-tabs nav-justified">
                        <router-link tag="li"
                                     role="presentation"
                                     active-class="active"
                                     :to="{name: 'user-projects', param: {userIdProperty: user.id}}">
                            <a href>Project I have done</a>
                        </router-link>
                        <router-link tag="li"
                                     role="presentation"
                                     active-class="active"
                                     :to="{name: 'user-skills', param: {userIdProperty: user.id}}">
                            <a href>Technique I have used</a>
                        </router-link>
                    </ul>
                    <!--<tabs v-model="tabIndex"-->
                          <!--@change="vOnTabSelected($event)">-->
                        <!--<tab title="Project I have done"></tab>-->
                        <!--<tab title="Techniques I have used"></tab>-->
                    <!--</tabs>-->
                </div>
            </div>
        </div>

        <!--Projects-->
        <div class="row">
            <router-view :user-id-property="user.id"/>
        </div>


        <!--Personal techniques-->
        <!--<div v-if="tabIndex === 1 && user">-->
            <!--<div v-if="user.techniques"-->
                 <!--v-for="technique in user.techniques">-->
                <!--<div class="row">-->
                    <!--<div class="col-lg-3 col-xs-4">-->

                        <!--<div class="panel panel-default">-->
                            <!--<div class="panel-body text-center">-->
                                <!--<img :src="technique.photo ? technique.photo : require('@/assets/skill.png')" :height="256" :width="256">-->
                                <!--<div class="text-center">-->
                                    <!--<span>{{technique.name}}</span>-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--<div class="panel-footer">-->
                                <!--<div class="text-center">-->
                                    <!--<button class="btn btn-info">-->
                                        <!--<span class="fa fa-camera"></span>-->
                                    <!--</button>-->
                                    <!--<span>&nbsp;</span>-->
                                    <!--<button class="btn btn-primary"-->
                                            <!--@click="vOnEditTechniqueClicked(technique)">-->
                                        <!--<span class="fa fa-edit"></span>-->
                                    <!--</button>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="col-lg-9 col-xs-8">-->
                        <!--<div class="form-group"-->
                             <!--v-for="skill in technique.skills">-->
                            <!--<progress-bar v-model="skill.point" label :label-text="skill.name"/>-->
                        <!--</div>-->
                        <!--<div class="pull-right">-->
                            <!--<button class="btn btn-primary"-->
                                    <!--v-on:click="vOnAddSkillClicked(technique)">-->
                                <!--<span class="glyphicon glyphicon-plus"></span>-->
                            <!--</button>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<hr/>-->
            <!--</div>-->
            <!--<div class="row">-->
                <!--<div class="col-lg-12">-->
                    <!--<button class="btn btn-primary btn-block"-->
                            <!--@click="vOnAddTechniqueClicked()">Add technique category-->
                    <!--</button>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->

        <!--Add/edit user description-->
        <modal :header="false"
               :footer="false"
               v-model="bUserDescriptionModalOpened"
               v-if="bUserDescriptionModalOpened"
               class="replace-body">
            <user-description-detail :user-description-property="selectedUserDescription"
                                     v-on:click-confirm="vOnUserDescriptionConfirm($event)"
                                     v-on:click-cancel="vOnUserDescriptionCancel()"/>
        </modal>


    </div>
</template>

<script>
    import UserDescriptionDetail from "./user-description-detail";
    import UserSkillDetail from "../../shared/skill-selector";
    import TechniqueDetail from '../skill-category/skill-category-detail';
    import {mapMutations} from 'vuex';

    export default {
        name: 'profile',
        components: {TechniqueDetail, UserSkillDetail, UserDescriptionDetail},
        dependencies: ['$user', '$userDescription', '$hobby', '$skill', '$responsibility', '$project', '$lodash', '$toastr'],
        data() {
            return {
                user: {
                    id: 1,
                    descriptions: [],
                    hobbies: [],
                    projects: [],
                    techniques: []
                },
                bUserDescriptionModalOpened: false,
                selectedUserDescription: null,
                selectedTechnique: null,

                selectedSkillCategory: null,
                tabIndex: 0
            }
        },
        computed: {},
        mounted() {

            // Get params in route.
            let params = this.$route.params;
            let userId = parseInt(params.id);

            // Get function context.
            let self = this;

            // Block UI.
            self.addLoadingScreen();

            // List of promises that needs resolving.
            let promises = [];

            // Find user information from cache. This is for preventing requesting to api end-point too many times.
            let user = params.user;
            if (user) {
                promises[0] = new Promise((resolve) => {
                    resolve(user);
                });
            } else {

                // Build search condition.
                let condition = {
                    userIds: [self.user.id],
                    pagination:{
                        page: 1,
                        records: 1
                    }
                };

                promises[0] = self.$user
                    .loadUsers(condition)
                    .then((loadUsersResult) => {
                        // Get users.
                        let users = loadUsersResult.records;
                        return users[0];
                    });
            }

            //region Load user hobbies
            promises[1] = self.loadUserHobbies();

            //Load user descriptions
            promises[2] = self.loadUserDescriptions();

            //#endregion

            Promise.all(promises)
                .then((loadRecordResults) => {

                    // Get user.
                    let user = loadRecordResults[0];
                    let hobbies = loadRecordResults[1];
                    let userDescriptions = loadRecordResults[2];

                    let pUser = {};
                    pUser.id = user.id;
                    pUser.firstName = user.firstName;
                    pUser.lastName = user.lastName;
                    pUser.photo = user.photo;

                    pUser.hobbies = hobbies;
                    pUser.descriptions = userDescriptions;
                    pUser.techniques = [];

                    // Update user information.
                    self.user = pUser;

                    self.$toastr.success('User data has been loaded successfully.');

                    // Unlock the app UI.
                    self.deleteLoadingScreen();
                });
        },
        methods: {

            // Map mutations.
            ...mapMutations([
                'addLoadingScreen',
                'deleteLoadingScreen'
            ]),

            /*
            * Load user hobbies by using specific conditions.
            * */
            loadUserHobbies() {
                // Get current function context.
                let self = this;

                // Get user id.
                return self.$hobby
                    .loadUserHobbies(null, [self.user.id], null)
                    .then((loadUserHobbiesResult) => {
                        return loadUserHobbiesResult.records;
                    })
                    .catch(() => {
                        self.user.hobbies = []
                    });
            },

            /*
            * Load user descriptions by using specific conditions.
            * */
            loadUserDescriptions() {
                // Get function context.
                let self = this;

                return self.$userDescription
                    .loadUserDescriptions(null, [self.user.id], null, null)
                    .then((loadUserDescriptionsResult) => {
                        return loadUserDescriptionsResult.records;
                    })
                    .catch(() => {
                        return [];
                    });
            },

            /*
            * Called when tab is selected.
            * */
            vOnTabSelected(tabIndex) {

                // // Get function context.
                // let self = this;
                //
                // switch (tabIndex) {
                //     case 1:
                //         // Clear user techniques.
                //         self.user.techniques = [];
                //
                //         this.loadUserTechniques()
                //             .then((techniques) => {
                //                 self.user['techniques'] = techniques;
                //             });
                //         break;
                //
                //     default:
                //
                //         // Clear user projects.
                //         self.user.projects = [];
                //
                //         this.loadUserProjects()
                //             .then((projects) => {
                //                 self.user['projects'] = projects;
                //             });
                // }
            },

            /*
            * Called when add user description is clicked.
            * */
            vOnAddUserDescriptionClick() {
                this.selectedUserDescription = {
                    userId: this.user.id,
                    description: ''
                };

                this.bUserDescriptionModalOpened = true;
            },

            /*
            * Called when add/edit user description is confirmed adding/editing.
            * */
            vOnUserDescriptionConfirm(model) {
                let self = this;

                // Block UI.
                self.addLoadingScreen();

                self.$userDescription
                    .addUserDescription(model.userId, model.description)
                    .then((userDescription) => {
                        self.bUserDescriptionModalOpened = false;

                        // Add description to list.
                        self.user.descriptions.push(userDescription);

                        self.$toastr.success('Added user description successfully.');
                        self.deleteLoadingScreen();
                    });
            },

            /*
            * Called when add/edit user description is cancelled.
            * */
            vOnUserDescriptionCancel() {
                this.bUserDescriptionModalOpened = false;
            }
        }
    }
</script>

<style scoped>

</style>