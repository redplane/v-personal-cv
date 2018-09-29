import {GetterTree} from "vuex";
import {RootState} from "@/stores/root/root.state";
import {Profile} from "@/models/profile";
import {AppSetting} from "@/models/app-setting";

export const getters: GetterTree<RootState, RootState> = {

    //#region Properties

    appSettings: (state: RootState): AppSetting | null => state.appSettings

    //#endregion

};