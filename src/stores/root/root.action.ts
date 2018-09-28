import {ActionContext, ActionTree} from "vuex";
import {RootState} from "@/stores/root/root.state";
import {AppSetting} from "@/models/app-setting";

export const actions: ActionTree<RootState, RootState> = {

    //#region Properties

    // Add app setting.
    addAppSetting({commit}: ActionContext<RootState, RootState>, appSetting: AppSetting): void {
        commit('addAppSetting', appSetting);
    }

    //#endregion

};