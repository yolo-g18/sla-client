import { ChangeEvent, FormEvent } from 'react'
import rootReducer from '../redux/reducers/index'

export type InputChange = ChangeEvent<HTMLInputElement>

export type FormSubmit = FormEvent<HTMLFormElement>

export type RootStore = ReturnType<typeof rootReducer>

export interface IUserLogin {
    username: string
    password: string
  }

  export interface IUserRegister extends IUserLogin {
      email: string
    username: string
    password: string
  }

  export interface IUser extends IUserLogin {
    avatar: string
    username: string
    fullname: string
    job: string
    phone: string
    email: string
    address: string
    createdAt: Date
    updatedAt: Date
    _id: number
    schoolName: string
    favourTimeFrom: Date
    favourTimeTo: Date
  }

  export interface errorsApiRes  {
    status? : string | null
    message? : string | null 
    errors : IErrors | null
  }

  export interface IErrors {
    email? : string,
    username? : string,
    password?: string
  }

  export interface IAlert {
    loading?: boolean
    success?: string | string[]
    errors?: errorsApiRes 
  }