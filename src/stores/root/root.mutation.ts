import {MutationTree} from "vuex";
import {AppSetting} from "@/models/app-setting";
import {RootState} from "@/stores/root/root.state";

export const mutations: MutationTree<RootState> = {

    //#region Methods

    // Add app setting.
    addAppSetting: (state: RootState, appSettings: AppSetting) => {
        state.appSettings = appSettings;
    }

    //#endregion
};