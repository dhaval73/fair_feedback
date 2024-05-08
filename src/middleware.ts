import { NextRequest ,NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export { default } from 'next-auth/middleware';

const authRoutes = ['/sign-in','/sign-up','/verify-email',]
const publicRoutes = ['/']
const protectedRoutes = ['/dasboard']

export  async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname
    const token = await getToken({req : request})

    console.log(path);
    if (token) {
        console.log('token',token)
    }else{
        console.log("token nathi")
    }

    if (token && authRoutes.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/dasboard', request.url))
    }

    if(!token && protectedRoutes.some(route => path.startsWith(route))){
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next()
}
