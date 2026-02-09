import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes except login page
  if (pathname.startsWith('/falconsadmin') && !pathname.includes('/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/falconsadmin/login', request.url));
    }

    // Simple token validation - just check if token exists and is valid format
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [email, timestamp] = decoded.split(':');

      // Basic validation - check if email format and timestamp exist
      if (!email || !timestamp || !email.includes('@')) {
        return NextResponse.redirect(new URL('/falconsadmin/login', request.url));
      }

      // Check if token is not too old (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (tokenAge > maxAge) {
        return NextResponse.redirect(new URL('/falconsadmin/login', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/falconsadmin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/falconsadmin/:path*'
};
