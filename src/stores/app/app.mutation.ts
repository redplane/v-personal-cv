import {ActionContext, MutationTree} from "vuex";
import {AppState} from "src/stores/app/app.state";
import {Profile} from "@/models/profile";
import {BlockUiOption} from "@/models/block-ui-option";
import {AppSetting} from "@/models/app-setting";

export const mutations: MutationTree<AppState> = {

    /*
    * Add profile to store.
    * */
    addProfile: (state: AppState, profile: Profile) => {
        state.profile = profile;
    },

    /*
    * Delete profile from store.
    * */
    deleteProfile: (state: AppState) => {
        state.profile = null;
    },

    /*
    * Add loading screen with specific configuration.
    * */
    addLoadingScreen: (state: AppState, options: BlockUiOption) => {
        if (!state.blockUi)
            return;

        if (options)
            state.blockUi = options;

        state.blockUi.available = true;
    },

    /*
    * Remove loading screen.
    * */
    deleteLoadingScreen: (state: AppState) => {
        if (state.blockUi == null)
            return;

        state.blockUi.available = false;
    },

    // Add app setting.
    addAppSetting: (state: AppState, appSetting: AppSetting) => {
        state.appSetting = appSetting;
    }
};