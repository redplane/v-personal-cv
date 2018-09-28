import {Module} from 'vuex';
import {RootState} from "@/stores/root/root.state";
import {UserServiceAction} from "@/stores/user-service/user-service.action";

const namespaced: boolean = true;
const state = new RootState();
export const apiUser: Module<RootState, RootState> = {
    namespaced,
    state,
    actions: UserServiceAction
};