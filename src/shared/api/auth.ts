import type { IUser } from "@/types/user"
import api from "./api"
import type { ResponseMessage } from "@/types/respose"

class AuthApi{
    public url ='auth/'

    async login(data: {email: string, password: string}):Promise<ResponseMessage<{user:IUser} & {accessToken: string}>>{
        return await api.post(this.url+'login', data)
    }

    async register(data: {name: string, email: string, password: string}):Promise<ResponseMessage<IUser>>{
        return await api.post(this.url+'register', data)
    }
}

export const authApi = new AuthApi()