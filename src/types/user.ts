export interface User {
  _id: string
  username: string
  password?: string
  fullname: string
  email: string
  isAdmin?: boolean
  createdAt?: Date
}

export interface UserFilter {
  txt?: string
  email?: string
}