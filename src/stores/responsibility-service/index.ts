import {Module} from 'vuex';
import {RootState} from "@/stores/root/root.state";
import {ResponsibilityServiceAction} from "@/stores/responsibility-service/responsibility-service.action";

const namespaced: boolean = true;
const state = new RootState();
export const apiResponsibility: Module<RootState, RootState> = {
    namespaced,
    state,
    actions: ResponsibilityServiceAction
};