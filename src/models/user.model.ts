import { UserObject } from "../domain/user"

export class User {
    id: number
    name: string
    last_name: string | null
    email: string
    email_verified_at: Date | null
    active: boolean
    current_team_id: number | null
    profile_photo_path: string | null
    profile_photo_url: string
    role: string
    two_factor_confirmed_at: Date | null
    two_factor_recovery_codes: string | null
    two_factor_secret: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date | null

    constructor(args: UserObject) {
        this.id = args.id
        this.name = args.name
        this.last_name = args.last_name
        this.email = args.email
        this.email_verified_at = args.email_verified_at
        this.active = args.active
        this.current_team_id = args.current_team_id
        this.profile_photo_path = args.profile_photo_path
        this.profile_photo_url = args.profile_photo_url
        this.role = args.role
        this.two_factor_confirmed_at = args.two_factor_confirmed_at
        this.two_factor_recovery_codes = args.two_factor_recovery_codes
        this.two_factor_secret = args.two_factor_secret
        this.created_at = args.created_at
        this.updated_at = args.updated_at
        this.deleted_at = args.deleted_at
    }

    static fromJson(json: UserObject): User {
        return new User(json)  
    }

    static fromArray(array: UserObject[]): User[] {
        return array.map(User.fromJson)
    }
}