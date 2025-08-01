export interface IUser {
  id: number
  name: string
  email: string
  role: 'user' | 'admin' 
  status: 'active' | 'blocked' 
  created_at: string 
  last_login: string | null
}