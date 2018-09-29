import {ActionContext, ActionTree} from 'vuex';
import {AppState} from "@/stores/app/app.state";
import {RootState} from "@/stores/root/root.state";
declare var $: any;
import * as toastr from "toastr";

export const actions: ActionTree<AppState, RootState> = {

    //#region Methods

    /*
    * Do scroll to top of an element.
    * */
    doScrollTop({commit}: ActionContext<AppState, RootState>, szElementQuery: string | any): void {
        $(szElementQuery).scrollTop(0);
    }

    //#endregion
};