"use server"
import { cookies } from 'next/headers'
 

export const getCookie = async (name:string) => {
  const cookieStore = await cookies()
  return cookieStore.get(name)
}

export const setCookie = async (name: string, value: string, exp: number) => {
  const cookieStore = await cookies()
  cookieStore.set(name, value, {expires: new Date(exp * 1000)})
}

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}
export const chechCookie = async (name: string)=>{
  const cookieStore = await cookies()
  return cookieStore.has(name)
}