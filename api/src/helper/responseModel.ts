import { ResponseStatus } from "../interfaces";

export const responseModel = ({message, status, result}: {message: string, status: ResponseStatus, result: any }) => {
    return {
        message,
        status,
        result
    }
}