import Vue from 'vue';
import Router from 'vue-router';

import MasterLayout from './components/shared/layout/master-layout.vue';
import AdminSideBar from './components/shared/admin-side-bar.vue';

import UserDashboard from './components/modules/user/dashboard.vue';
import SkillDashboard from './components/modules/skill/dashboard.vue';
import SkillCategoryDashboard from './components/modules/responsibility/dashboard.vue';
import Profile from './components/modules/user/profile.vue';
import ManagementLayout from '@/components/modules/management-layout.vue';


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
                    component: Profile
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
                                default: SkillDashboard,
                                adminSideBar: AdminSideBar
                            }
                        },
                        {
                            path: 'responsibility-management',
                            components: {
                                default: SkillCategoryDashboard,
                                adminSideBar: AdminSideBar
                            }
                        },
                        {
                            path: 'user-management',
                            components: {
                                default: UserDashboard,
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