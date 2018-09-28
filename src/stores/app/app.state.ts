import {Profile} from "@/models/profile";
import {BlockUiOption} from '@/models/block-ui-option';
import {AppSetting} from "@/models/app-setting";

export class AppState {

    //#region Properties

    // Profile information.
    public profile: Profile | null = null;

    // Block UI configuration.
    public blockUi: BlockUiOption | null = null;

    // Application setting.
    public appSetting: AppSetting | null = null;

    //#endregion
}