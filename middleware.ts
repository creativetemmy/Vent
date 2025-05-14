
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if user is logged in from the session cookie
  const isAuthenticated = request.cookies.has('sb-access-token') || 
                        request.cookies.has('sb-refresh-token');
  
  // Auth page accessible only if user is not logged in
  if (path === '/auth') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected pages
  const isProtectedRoute = !path.startsWith('/_next') && 
                         !path.startsWith('/api') && 
                         !path.includes('.') &&
                         path !== '/auth';
  
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
