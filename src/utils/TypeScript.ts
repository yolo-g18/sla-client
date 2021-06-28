import { ChangeEvent, FormEvent } from 'react'

export type InputChange = ChangeEvent<HTMLInputElement>

export type FormSubmit = FormEvent<HTMLFormElement>

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
    createdAt: string
    username: string
    fullname: string
    job: string
    phone: string
    email: string
    address: string
    updatedAt: string
    _id: string
    schoolName: string
    favourTimeFrom: Date
    favourTimeTo: Date
  }

  export interface IAlert {
    loading?: boolean
    success?: string | string[]
    errors?: string | string[]
  }