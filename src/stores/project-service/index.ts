import {Module} from 'vuex';
import {RootState} from "@/stores/root/root.state";
import {ProjectServiceAction} from '@/stores/project-service/project-service.action';

const namespaced: boolean = true;
const state = new RootState();
export const apiProject: Module<RootState, RootState> = {
    namespaced,
    state,
    actions: ProjectServiceAction
};