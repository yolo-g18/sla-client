import { ChangeEvent, FormEvent } from 'react'
import rootReducer from '../redux/reducers/index'

export type InputChange = ChangeEvent<HTMLInputElement>

export type FormSubmit = FormEvent<HTMLFormElement>

export type RootStore = ReturnType<typeof rootReducer>

export interface IUserLogin {
    username: string | undefined
    password: string | undefined
  }

  export interface IUserRegister extends IUserLogin {
      email: string | undefined
    username: string | undefined
    password: string | undefined
  }

 

  export interface IUser extends IUserLogin {
    _id: number | undefined
    username: string | undefined
    firstname: string | undefined
    avatar: string | undefined
    lastname: string | undefined
    job: string | undefined
    email: string | undefined
    address: string | undefined
    schoolName: string | undefined
    major: string | undefined
    bio: string | undefined
    createdAt: Date | undefined
    updatedAt: Date | undefined
    favourTimeFrom: Date|  undefined
    favourTimeTo: Date | undefined
  }

  export interface errorsApiRes  {
    status? : number | null
    message? : string | null 
    errors? : IErrors
  }

  export interface IErrors {
    email? : string,
    username? : string,
    password?: string
    bio?: string
  }


  export interface IAlert {
    loading?: boolean
    success?: string | string[]
    errors?: errorsApiRes 
  }