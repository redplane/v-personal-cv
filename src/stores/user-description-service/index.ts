import {Module} from 'vuex';
import {RootState} from "@/stores/root/root.state";
import {UserDescriptionServiceAction} from "@/stores/user-description-service/user-description-service.action";

const namespaced: boolean = true;
const state = new RootState();
export const apiUserDescription: Module<RootState, RootState> = {
    namespaced,
    state,
    actions: UserDescriptionServiceAction
};