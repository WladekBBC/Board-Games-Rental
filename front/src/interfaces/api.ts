export interface IUserApi{
  token: string,
  permissions: string,
}

export enum Method{
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export const request = async <T> (url: string, method: Method, headers?: {[x:string]: string}, body?: string): Promise<T> =>{
  return fetch(url, {
    method: method, 
    headers: {
        "Content-Type": "application/json",
        ...headers
    }, 
    body: body, 
    mode:'cors'
  }).then((res: Response)=>{
    if(res.ok)
      return res.json();
    return Promise.reject(new Error(res.statusText, {cause: res.status}))
  })
}