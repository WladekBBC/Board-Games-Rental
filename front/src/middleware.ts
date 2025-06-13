import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { IUser } from './interfaces/user'
import { Perms } from './interfaces/perms'
 
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('Authorization')
  const perms = auth ? jwtDecode<IUser>(auth.value).permissions : Perms.U

  if (['/register', '/login'].includes(request.nextUrl.pathname) && auth) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  if (['/rentals', '/games', '/users'].includes(request.nextUrl.pathname) && !auth && perms == Perms.U) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
export const config = {
  matcher: ['/', '/login', '/register', '/rentals', '/games', '/users'],
}