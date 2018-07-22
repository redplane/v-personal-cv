import Vue from 'vue';
import Router from 'vue-router';

import MasterLayout from './components/shared/layout/master-layout.vue';
import AdminSideBar from './components/shared/admin-side-bar.vue';

import UserManagement from './components/modules/management/user-management.vue';
import SkillManagement from './components/modules/management/skill-management.vue';
import ResponsibilityManagement from './components/modules/management/responsibility-management.vue';

import Profile from './components/modules/user/profile.vue';
import ManagementLayout from '@/components/modules/management-layout.vue';
import UserProjectDashboard from '@/components/modules/project/dashboard.vue';
import UserSkill from '@/components/modules/technique/dashboard.vue';

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
                    path: '/user/:id',
                    name: 'profile',
                    component: Profile,
                    children: [
                        {
                            path: 'projects',
                            name: 'user-projects',
                            component: UserProjectDashboard,
                            props: true
                        },
                        {
                            path: 'skill',
                            name: 'user-skills',
                            component: UserSkill,
                            props: true
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