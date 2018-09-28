import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import {apiUser} from "@/stores/user-service";
import {apiUserDescription} from "@/stores/user-description-service";
import {apiResponsibility} from '@/stores/responsibility-service';
import {apiProject} from '@/stores/project-service';
import {apiSkill} from "@/stores/skill-service";
import {app} from '@/stores/app';

import {actions} from "@/stores/root/root.action";
import {mutations} from "@/stores/root/root.mutation";
import {RootState} from '@/stores/root/root.state';

export default new Vuex.Store({
    state: new RootState(),
    actions,
    mutations,
    modules: {
        app,
        apiUser: apiUser,
        apiUserDescription,
        apiResponsibility,
        apiProject,
        apiSkill
    }
});