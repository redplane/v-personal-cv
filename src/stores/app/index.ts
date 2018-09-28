import {Module} from 'vuex';
import {AppState} from "@/stores/app/app.state";
import {mutations} from "@/stores/app/app.mutation";
import {getters} from "@/stores/app/app.getter";
import {BlockUiOption} from "@/models/block-ui-option";
import {RootState} from "@/stores/root/root.state";
import {AppSetting} from "@/models/app-setting";

export const state: AppState = {
    profile: null,
    blockUi: new BlockUiOption(),
    appSetting: new AppSetting()
};

const namespaced: boolean = true;

export const app: Module<AppState, RootState> = {
    namespaced,
    state,
    getters,
    mutations
};