import { APP_PAGES } from '@/config/pages-url.config'
import { EnumTokens } from '@/services/auth-token.service'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest, response: NextResponse) {
  const { url, cookies } = request
  const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value
  const isAuthPage = url.includes(APP_PAGES.LOGIN) || url.includes(APP_PAGES.REGISTER)
  const isProfilePage = url.includes(APP_PAGES.PROFILE)

  // If user is on an auth page and has a refresh token, redirect to subscriptions
  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL(APP_PAGES.SUBSCRIPTIONS, url))
  }

  // If user is trying to access the profile page without a refresh token, redirect to login
  if (isProfilePage && !refreshToken) {
    return NextResponse.redirect(new URL(APP_PAGES.LOGIN, url))
  }

  // If user is on an auth page and does not have a refresh token, allow access
  if (isAuthPage) {
    return NextResponse.next()
  }

  // If user does not have a refresh token, redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL(APP_PAGES.LOGIN, url))
  }

  // Allow access to all other pages
  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/login', '/register'],
}
