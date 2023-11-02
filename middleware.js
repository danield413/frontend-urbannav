import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  
  //token ls
  // const token = localStorage.getItem('token')

  // // If the user is logged in, continue to the page
  // if (token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // } else {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return NextResponse.next()

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/register', '/dashboard'],
}