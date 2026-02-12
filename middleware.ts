import { NextRequest, NextResponse } from 'next/server';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const ADMIN_MUTATION_API_PREFIXES = [
  '/api/profile',
  '/api/projects',
  '/api/skills',
  '/api/education',
  '/api/experience',
  '/api/testimonials',
  '/api/community/stats',
  '/api/homepage-assets',
];

function isAdminProtectedRequest(pathname: string, method: string): boolean {
  if (pathname.startsWith('/admin')) {
    return true;
  }

  // Public POST is allowed for contact form submit.
  if (pathname.startsWith('/api/community/messages')) {
    return method === 'GET';
  }

  // Upload endpoints are admin-only.
  if (pathname.startsWith('/api/upload')) {
    return true;
  }

  return (
    MUTATION_METHODS.has(method) &&
    ADMIN_MUTATION_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

function parseBasicAuthCredentials(
  authorizationHeader: string | null
): { username: string; password: string } | null {
  if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64Credentials = authorizationHeader.slice('Basic '.length).trim();
    const decodedCredentials = atob(base64Credentials);
    const separatorIndex = decodedCredentials.indexOf(':');

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decodedCredentials.slice(0, separatorIndex),
      password: decodedCredentials.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function unauthorizedResponse(isApiRoute: boolean): NextResponse {
  const headers = new Headers({
    'WWW-Authenticate': 'Basic realm="Admin Area"',
  });

  if (isApiRoute) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401, headers }
    );
  }

  return new NextResponse('Authentication required', { status: 401, headers });
}

function authNotConfiguredResponse(isApiRoute: boolean): NextResponse {
  if (isApiRoute) {
    return NextResponse.json(
      { success: false, error: 'Admin authentication is not configured' },
      { status: 503 }
    );
  }

  return new NextResponse('Admin authentication is not configured', {
    status: 503,
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  if (!isAdminProtectedRequest(pathname, method)) {
    return NextResponse.next();
  }

  const expectedUsername = process.env.ADMIN_BASIC_AUTH_USER;
  const expectedPassword = process.env.ADMIN_BASIC_AUTH_PASSWORD;
  const isApiRoute = pathname.startsWith('/api/');

  if (!expectedUsername || !expectedPassword) {
    return authNotConfiguredResponse(isApiRoute);
  }

  const providedCredentials = parseBasicAuthCredentials(
    request.headers.get('authorization')
  );

  if (
    !providedCredentials ||
    providedCredentials.username !== expectedUsername ||
    providedCredentials.password !== expectedPassword
  ) {
    return unauthorizedResponse(isApiRoute);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
