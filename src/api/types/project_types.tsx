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
  createTime: string
  createUser: string
  projectName: string
  roleLevel: string
  realName: string
  countScene: string
}
