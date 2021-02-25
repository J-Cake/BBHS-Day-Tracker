export interface APIResponse {
    code: APISuccessCode,
    // descriptor: APIStatusDescriptor,
    time?: number,
    userId?: string,
    body?: any
}

export enum APISuccessCode {
    processing,
    loginSuccess,
    loginDenied,
    invalidUserKey
}
