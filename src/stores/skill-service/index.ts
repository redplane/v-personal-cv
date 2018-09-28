import {Module} from 'vuex';
import {RootState} from "@/stores/root/root.state";
import {SkillServiceAction} from "@/stores/skill-service/skill-service.action";

const namespaced: boolean = true;
const state = new RootState();
export const apiSkill: Module<RootState, RootState> = {
    namespaced,
    state,
    actions: SkillServiceAction
};