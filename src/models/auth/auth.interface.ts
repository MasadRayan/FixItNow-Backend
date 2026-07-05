export interface ICreateUser {
    name : string,     
    email : string,
    password : string,
    phone : string,
    role: 'CUSTOMER' | 'TECHNICIAN',
    address ?: string,
    avatarUrl ?: string
}