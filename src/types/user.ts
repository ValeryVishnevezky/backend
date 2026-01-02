export interface PublicUser {
	_id: string
	username: string
	fullname: string
	email: string
	isAdmin: boolean
}

export interface SignupUser {
	username: string
	password: string
	fullname: string
	email: string
}

export interface LoginUser {
	password: string
	email: string
}

export interface TokenUser {
	_id: string
	email: string
}

export interface UserFilter {
	txt?: string
	email?: string
}
