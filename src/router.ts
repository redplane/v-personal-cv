import Vue from 'vue';
import Router from 'vue-router';

import MasterLayout from './components/shared/layout/master-layout.vue';
import AdminSideBar from './components/shared/admin-side-bar.component.vue';

import UserManagement from './components/modules/management/user-management.vue';
import SkillManagement from './components/modules/management/skill-management.vue';
import ResponsibilityManagement from './components/modules/management/responsibility-management.vue';

import ProfileMasterLayout from './components/modules/user/master-layout.component.vue';
import ProfileComponent from "@/components/modules/user/profile.component.vue";
import ManagementLayout from '@/components/modules/management-layout.component.vue';
import UserProject from '@/components/modules/user/profile-project.component.vue';
import UserSkill from '@/components/modules/user/profile-skill.vue';
import UserHobbyComponent from '@/components/modules/user/profile-hobby.component.vue';


export default new Router({
    routes: [
        {
            path: '/',
            component: MasterLayout,
            children: [
                {
                    path: '/',
                    name: 'default',
                    redirect: 'management'
                },
                {
                    path: '/user',
                    name: 'profile',
                    component: ProfileMasterLayout,
                    children: [
                        {
                            path: 'project/:userId',
                            name: 'user-project',
                            component: UserProject,
                            props: true
                        },
                        {
                            path: 'skill/:userId',
                            name: 'user-skill',
                            component: UserSkill,
                            props: true
                        },
                        {
                            path: 'hobby/:userId',
                            name: 'user-hobby',
                            component: UserHobbyComponent,
                            props: true
                        },
                        {
                            path: 'about-me/:userId',
                            name: 'about-me',
                            component: ProfileComponent
                        },
                        {
                            path: ':id',
                            redirect: 'about-me/:id'
                        }
                    ]
                },
                {
                    path: 'management',
                    component: ManagementLayout,
                    children: [
                        {
                            path: '',
                            redirect: 'user-management'
                        },
                        {
                            path: 'skill-management',
                            components: {
                                default: SkillManagement,
                                adminSideBar: AdminSideBar
                            }
                        },
                        {
                            path: 'responsibility-management',
                            components: {
                                default: ResponsibilityManagement,
                                adminSideBar: AdminSideBar
                            }
                        },
                        {
                            path: 'user-management',
                            components: {
                                default: UserManagement,
                                adminSideBar: AdminSideBar
                            }
                        }
                    ]
                }
            ]
        }
    ]
});

Vue.use(Router);