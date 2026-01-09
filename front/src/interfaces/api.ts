import { getCookie } from "@/app/actions";

export interface IUserApi{
  token: string,
}

export enum Method{
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export const request = async <T> (url: string, method: Method, body?: string, headers?: {[x:string]: string}): Promise<T> =>{
  return fetch( process.env.NEXT_PUBLIC_API_URL + url, {
    method: method, 
    headers: {
        "Content-Type": "application/json",
        "Authorization": `${(await getCookie('Authorization'))?.value}`,
        ...headers
    }, 
    body: body, 
    mode:'cors'
  }).then((res: Response)=>{
    if(res.ok)
      return res.json();
    throw new Error(res.statusText, {cause: res.status})
  })
}