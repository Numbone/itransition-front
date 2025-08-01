import type { ResponseMessage } from "@/types/respose"
import api from "./api"
import type { IUser } from "@/types/user"


class UserApi{
    public url = '/users'

    async getUsers():Promise<ResponseMessage<IUser[]>>{
        return await api.get(this.url)
    }

    getUser(id:string){
        return api.get(this.url+'/'+id)
    }

    updateUsersBlock(ids:number[]){
        return api.post(this.url+'/block',{ids})
    }

    updateUsersUnblock(ids:number[]){
        return api.post(this.url+'/unblock',{ids})
    }

    deleteUsers(ids:number[]){
        return api.post(this.url+'/delete',{ids})
    }

    updateUserStatus(id: number, status: "active" | "blocked") {
    const method = status === "active" ? this.updateUsersUnblock : this.updateUsersBlock
    return method.call(this, [id])
  }

}

export const userApi = new UserApi()