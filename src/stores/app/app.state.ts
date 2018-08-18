import {Profile} from "@/models/profile";
import {BlockUiOption} from '@/models/block-ui-option';

export class AppState {

    //#region Properties

    /*
    * Profile information.
    * */
    public profile: Profile|null = null;

    /*
    * Block UI configuration.
    * */
    public blockUi: BlockUiOption|null = null;

    //#endregion
}