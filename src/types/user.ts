export interface User {
  _id: string
  username: string
  password?: string
  fullname: string
  email: string
  isAdmin?: boolean
}

export interface LoginUser {
  username?: string
  password?: string
  email?: string
}

// export interface SignupUser {
//   username: string
//   password: string
//   fullname: string
//   email: string
// }

export interface UserFilter {
  txt?: string
  email?: string
}