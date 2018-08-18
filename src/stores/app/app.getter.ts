import {GetterTree} from 'vuex';
import {AppState} from "@/stores/app/app.state";
import {Profile} from "@/models/profile";

export const getters: GetterTree<AppState, AppState> = {

    /*
    * Get profile information.
    * */
    profile: (state: AppState): Profile | null => state.profile,

    /*
    * Get block UI instance.
    * */
    blockUi: (state: any) => state.blockUi

};