import { User } from "../models/user.model"

export interface Dto<T> {
    message: string,
    success: boolean,
    data: T
}

export interface ResponseData {
    token: string,
    token_type: string,
    user: UserObject
}

export interface UserObject {
    id: number,
    name: string,
    last_name: string | null,
    email: string,
    email_verified_at: Date | null,
    active: boolean,
    current_team_id: number | null,
    profile_photo_path: string | null,
    profile_photo_url: string,
    role: string,
    two_factor_confirmed_at: Date | null,
    two_factor_recovery_codes: string | null,
    two_factor_secret: string | null,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null,
}

export class LoginResponseDto implements Dto<ResponseData> {
    message: string
    success: boolean
    data: ResponseData
    user: User

    constructor(message: string, success: boolean, data: ResponseData) {
        this.message = message
        this.success = success
        this.data = data
        this.user = User.fromJson(data.user)
    }
}