import { getCookie } from "@/app/actions";
import { getApiUrl } from "@/lib/env";

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
  const api = getApiUrl();
  const path = url.startsWith("/") ? url : `/${url}`;
  const authCookie = await getCookie('Authorization');

  const response = await fetch(`${api}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(authCookie?.value ? { Authorization: authCookie.value } : {}),
      ...headers,
    },
    body: body,
    mode:'cors'
  });

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    return response.json() as Promise<T>;
  }

  throw new Error(response.statusText, { cause: response.status })
}
