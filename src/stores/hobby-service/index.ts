import {Module} from 'vuex';
import {RootState} from "@/stores/root/root.state";
import {HobbyServiceAction} from "@/stores/hobby-service/hobby-service.action";

const namespaced: boolean = true;
const state = new RootState();
export const apiResponsibility: Module<RootState, RootState> = {
    namespaced,
    state,
    actions: HobbyServiceAction
};