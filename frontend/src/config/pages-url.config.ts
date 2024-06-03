class APP {
  private rootPath: string = "/"

  HOME = this.rootPath

  LOGIN = `${this.rootPath}login`
  REGISTER = `${this.rootPath}register`

  PROFILE = `${this.rootPath}profile`

  REQUEST_YOUR_SERVICE = `${this.rootPath}request-service`

  SUBSCRIPTIONS = `${this.rootPath}subscriptions`
}

export const APP_PAGES = new APP()
