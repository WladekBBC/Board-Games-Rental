import { Dispatch, SetStateAction } from "react";
import { EventSource } from 'eventsource'
import { getCookie } from "@/app/actions";

export const API_URL = 'http://localhost:3001/'

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
  return fetch(API_URL + url, {
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

export const stream = (url: string, setter: Dispatch<SetStateAction<any>>, headers?: {[x:string]: string}) =>{
  const event = new EventSource(API_URL + url, {
    fetch: async (input, init) =>
      fetch(input, {
        ...init,
        headers: {
          "Authorization": `${(await getCookie('Authorization'))?.value}`,
          ...init.headers,
          ...headers
        },
      })
  })
  event.onmessage = ({ data }) =>{
    setter(JSON.parse(data))
  }

  return () => event.close();
}