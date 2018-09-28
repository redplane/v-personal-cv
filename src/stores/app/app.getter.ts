import {GetterTree} from 'vuex';
import {AppState} from "@/stores/app/app.state";
import {Profile} from "@/models/profile";
import {RootState} from "@/stores/root/root.state";

export const getters: GetterTree<AppState, RootState> = {

    /*
    * Get profile information.
    * */
    profile: (state: AppState): Profile | null => state.profile,

    /*
    * Get block UI instance.
    * */
    blockUi: (state: any) => state.blockUi,

    // App setting
    appSetting: (state: AppState) => state.appSetting
};