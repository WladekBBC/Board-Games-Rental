import { Dispatch, SetStateAction } from "react";
import { EventSource } from 'eventsource'

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
    throw new Error(res.statusText, {cause: res.status})
  })
}

export const stream = (url: string, setter: Dispatch<SetStateAction<any>>, headers?: {[x:string]: string}) =>{
  const event = new EventSource(url, {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          ...headers
        },
      }),
  })
  event.onmessage = ({ data }) =>{
    setter(JSON.parse(data))
  }
  return () => event.close();
}