
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For client-side authentication we'll handle this in the components
  // This is primarily a placeholder for server-side auth checks in the future
  return NextResponse.next();
}
