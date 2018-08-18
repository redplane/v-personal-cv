import {ActionTree} from "vuex";
import {IApiServiceAction} from "@/stores/interfaces/api-service.action.interface";
import axios from 'axios';

export class ApiServiceAction implements IApiServiceAction  {

    public loadUsers(): Promise<any> {
        return new Promise(resolve => {
            resolve({
                id: 1,
                name: '2'
            });
        })
    }
}