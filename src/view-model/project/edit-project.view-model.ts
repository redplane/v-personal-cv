export class EditProjectViewModel {

    //#region Properties

    public id: number = 0;

    public userId: number = 0;

    public name: string = '';

    public description: string = '';

    public startedTime: number = 0;

    public finishedTime: number = 0;

    public skillIds: number[] | null = null;

    public responsibilityIds: number[] | null = null;

    //#endregion
}