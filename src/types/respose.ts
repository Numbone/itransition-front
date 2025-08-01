
export interface ResponseMessage<T>{
    message: string;
    success: boolean
    responseObject: T | null
    statusCode: number
}