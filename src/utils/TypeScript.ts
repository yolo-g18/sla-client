import { ChangeEvent, FormEvent } from 'react'
import { TriggerConfig } from 'react-hook-form'
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

export interface IUser {
  _id?: number 
  username?: string 
  firstname?: string 
  avatar?: string 
  lastname?: string 
  job?: string 
  email?: string 
  address?: string 
  schoolName?: string 
  major?: string 
  bio?: string 
  createdAt?: Date
  updatedAt?: Date 
  favourTimeFrom?: Date
  favourTimeTo?: Date
}

export interface IUserInfo {
  user?:IUser
}

export interface ISearch {
  keyword?:string
  type?:number
  searchBy?:number
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
    title?:string
    description?:string
    name?:string
  }


  export interface IAlert {
    loading?: boolean
    success?: string | string[]
    errors?: errorsApiRes 
  }

  export interface ISet {
    title? :string
    limit?: number
    desc?: string
    tag?: string
    isPublic?: boolean
  }

  export interface ICard {
    index?: number
    cardId?:number
    id?:number
    front: string
    back: string
    q?:number
    color?: string
  }

  export interface ICardLearning {
    userId?:number
    cardId?:number
    studySetId?:number
    front:string
    back:string
    hint?:string
    color?:string
  }

  export interface IStudySetLearning {
    userID:number
    studySetId: number
    owner: string
    creatorAvatar?:string
    studySetName: string  
    ssDescription: string | ""
    progress: number
    status: string
    rating: number
    color: string
    numberOfCards: number
  }

  export interface IStudySetInfo {
    _id?:number
    title?: string
    description: string | ""
    tag?:string 
    creatorName?:string
    isPublic?:false
    numberCard?: number
  }

  export interface IStudySetInfo2 {
    id?:number
    creator?:string
    creatorAvatar?:string
    title: string
    description: string | ""
    tag?:string 
    creatorName?:string
    isPublic?:false
    numberOfCards?: number
  }
  
  export interface IEvent {
    id?: number
    username?:string
    description?:string
    fromTime?:Date
    toTime?: Date
    color?:string
    createDate?:Date
    updateDate?:Date
  }
 
  export interface IEventRe {
    startDate:Date
    endDate:Date
    title?: string
    notes?:string
    id:number
    color?:string
  }

  export interface IFolder {
    folder_id: number;
    title: string;
    description: string;
    color: string;
    numberOfSets: number;
    createdDate: string;
    creatorUserName: string;
  };

  export interface INewFolder {
 
    title: string;
    color: string;
    description: string;
    creator_id: string;
  };
  
  export interface IRoom {
    room_id: number;
    name: string;
    numberOfMembers: number;
    createdDate: string;
    ownerName: string;
  };

  //number sets, folders, members in room
  export interface INumberEntity {
    setNumbers?:number
    folderNumbers?:number
    memberNumbers?:number
  }
  

export interface INewRoom {
  room_id: number;
  name: string;
  description: string;
  createdDate: string;
  ownerId?: number;
  ownerName: string;
  setNumbers: number;
  folderNumbers: number;
};
  
  

  export interface IStudySet{
    studySet_id:number
    title: string
    description: string | ""
    tags:string 
    numberOfCards:number
    creatorName:string
    color:string
    
  }
  

  export interface ISetAdd{
    id:number
    title?:string
  }
  export interface ICardLite {
    front?:string
    back?:string
  }

  export interface ISSResultSearch {
    id:number
    creator: string
    creatorAvatar:string
    title: string 
    tag:string | ""
    description:string | ""
    numberOfCards:number
    createdDate:Date
    first4Cards: ICardLite[]
  }

  export interface IMember{
    member_id:number
    userName?:string
    avatar?:string
  }

  export interface IGuestRoom{
    user_id:number
    userName?:string
    avatar?: string

  }
  export interface IUserResultSearch {
  userId?: number
  username: string
  avatar: string
  bio: string
  numberStudySetOwn: number
}

  export interface IRoomResultSearch {
    id:number
    owner:string
    name:string
    description:string
    createdDate:Date
    numberOfMembers:number
    numberOfStudySets:number
  }

  export interface IEventReq {
    color: string
    name: string
    description: string
    fromTime: Date
    toTime: Date
    isLearnEvent: boolean
  }
  export interface IEventRes {
    id: number
        userId: number
        name: string
        description?: string
        isLearnEvent: boolean
        fromTime: Date
        toTime: Date
        color?: string | null
        createdTime: number
        updateTime: number
        isDone?:boolean
        
  }

export interface IHostInvitation {
  roomId: number
  roomName: string
  userNameHost: string
  timeInvited: string
}


export interface INotification {
  id:number
  title: string
  description: string
  link: string
  createdTime: string
  read:boolean
}

export interface IEventHandle {
  typeAction?: number
  currentEvn?: IEventRes | undefined
  time?: Date
  dateFrom?:Date
  dateTo?:Date
}

export interface ILearnActionPayload {
  ssID?:number
  learnDate?: Date
  isDone?: boolean
  evnID?:number
}

export interface IFeedback {
  userName?: string
  rating?:number
  feedback?:string
  avatar?:string
}

export interface IReport {
  id?:number
  ssId:number
  ssTitle?:string
  reporter?:string
  content?:string
  user_avatar?:string
  checked?:boolean
  createdTime?: Date
}

export interface IReportSs {
  reportId: number
  content: string
  reporter:string
  reportedDate: string
}
