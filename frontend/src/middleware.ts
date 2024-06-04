import { APP_PAGES } from '@/config/pages-url.config'
import { EnumTokens } from '@/services/auth-token.service'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest, response: NextResponse) {
  const { url, cookies } = request
  const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value
  const isLoginPage = url.includes(APP_PAGES.LOGIN)
  const isRegisterPage = url.includes(APP_PAGES.REGISTER)
  const isAuthPage = isLoginPage || isRegisterPage
  const isProfilePage = url.includes(APP_PAGES.PROFILE)

  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL(APP_PAGES.SUBSCRIPTIONS, url))
  }

  if (isAuthPage) {
    return NextResponse.next()
  }

  if (!refreshToken && isProfilePage) {
    return NextResponse.redirect(new URL(APP_PAGES.LOGIN, request.url))
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL(APP_PAGES.LOGIN, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/profile', '/:path'],
}
