export interface IProject {
  limit: number
  page: number
  po: {
    projectName?: string
    type: string
  }
}
export interface IProjectScene {
  dbId: string
  roleLevel: string
  realName: string
}
