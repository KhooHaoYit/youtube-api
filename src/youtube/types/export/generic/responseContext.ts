export type ResponseContext = {
  mainAppWebResponseContext: {
    loggedOut: boolean
  }
}

export function isLoggedIn(data: ResponseContext) {
  return !data.mainAppWebResponseContext;
}
