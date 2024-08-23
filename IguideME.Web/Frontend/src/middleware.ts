import { type NextRequest, NextResponse } from 'next/server';

import { type User, UserRoles } from './types/user';
import { getUserServerSide } from './utils/get-user-server-side';

// eslint-disable-next-line import/exports-last, import/group-exports -- The config only works when exported first.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js files)
     * - mockServiceWorker.js (MSW service worker)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next|mockServiceWorker.js|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

// Define routes that are accessible only by admins
const adminRoutes = ['/courses/*', '/courses/*/admin/*'];
// Define routes that do not exist without wildcards
const nonExistingRoutes = ['/courses', '/courses/*/students', '/courses/*/admin'];
// Define routes that are accessible only by students
const studentRoutes = ['/courses/*/students/*/settings'];
// All other routes are accessible to both students and admins

/**
 * Matches a route against a pattern with (optionally) wildcards.
 * @returns True if the route matches the pattern, false otherwise.
 */
function matchRoute(pattern: string, route: string): boolean {
  const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
  return regex.test(route);
}

/**
 * Checks if a user is allowed to access a certain route.
 *
 * @param isAdmin - If true, the user is an admin; otherwise, the user is a student.
 * @param destination - The target route.
 * @returns True if the user can visit the route, false otherwise.
 */
function canAccessRoute(role: UserRoles | 'unknown', destination: string): boolean {
  const isNonExistingRoute = nonExistingRoutes.some((route) => matchRoute(route, destination));
  //   console.log('in access route: isNonExistingRoute', isNonExistingRoute);
  if (isNonExistingRoute) return false;

  const isStudentRoute = studentRoutes.some((route) => matchRoute(route, destination));
  //   console.log('in access route: isStudentRoute', isStudentRoute);
  if (isStudentRoute) return role === UserRoles.Student;

  const isAdminRoute = adminRoutes.some((route) => matchRoute(route, destination));
  //   console.log('in access route: isAdminRoute', isAdminRoute);
  if (isAdminRoute) return role === UserRoles.Instructor;

  return true;
}

/**
 * Finds a valid route that the user can access.
 *
 * @param isAdmin - If true, the user is an admin; otherwise, the user is a student.
 * @param destination - The target route.
 * @returns The valid route if found, otherwise null.
 */
function findValidRoute(user: User | null, destination: string): string | null {
  // There is one special case:
  // Students on the course page should be redirected to the student's dashboard.
  if (user && user.role === UserRoles.Student && matchRoute('/courses/*', destination)) {
    return `/courses/${String(user.course_id)}/students/${String(user.studentnumber)}`;
  }

  const pathSegments = destination.split('/').filter(Boolean);

  // Iterate through the path segments to find a valid route
  while (pathSegments.length > 0) {
    const currentPath = `/${pathSegments.join('/')}`;
    const isNonExistingRoute = nonExistingRoutes.some((route) => matchRoute(route, currentPath));

    if (!isNonExistingRoute && canAccessRoute(user ? user.role : 'unknown', currentPath)) {
      return currentPath;
    }
    pathSegments.pop();
  }

  return canAccessRoute(user ? user.role : 'unknown', '/') ? '/' : null;
}

/**
 * Middleware function to handle route access control.
 *
 * @param request - The incoming request object.
 * @returns A response object or undefined.
 */
async function middleware(request: NextRequest): Promise<Response | undefined> {
  const destination = request.nextUrl.pathname;

  let user: User | null = null;
  if (process.env.NODE_ENV === 'development') {
    // Test instructor
    user = {
      course_id: 994,
      studentnumber: 42,
      userID: '42',
      name: 'Course Admin',
      sortable_name: 'Admin, Course',
      role: UserRoles.Instructor,
      settings: undefined,
    };

    // Test student
    // user = {
    //   course_id: 994,
    //   studentnumber: 95372011,
    //   userID: '95372011',
    //   sortable_name: 'Rape, Quiana',
    //   name: 'Quiana Rape',
    //   role: UserRoles.Student,
    //   settings: {
    //     consent: false,
    //     goal_grade: 5,
    //     predicted_grade: 4,
    //     total_grade: 4,
    //     notifications: true,
    //   },
    // };
  } else {
    user = await getUserServerSide();
  }

  const isNonExistingRoute = nonExistingRoutes.some((route) => matchRoute(route, destination));
  //   console.log('isNonExistingRoute', isNonExistingRoute);

  let validRoute: string | null = destination;
  if (isNonExistingRoute) {
    validRoute = findValidRoute(user, destination);
    if (validRoute === null) {
      return Response.json({ success: false, message: 'authentication failed' }, { status: 401 });
    }
  }

  //   console.log('validRoute', validRoute);
  //   console.log('user.role', user ? user.role : 'unknown');
  //   console.log('canAccessRoute', canAccessRoute(user ? user.role : 'unknown', destination));

  // Check if the user can access the destination route
  if (!canAccessRoute(user ? user.role : 'unknown', destination)) {
    validRoute = findValidRoute(user, destination);
    if (validRoute === null) {
      return Response.json({ success: false, message: 'authentication failed' }, { status: 401 });
    }
  }

  // If the valid route is the same as the destination, proceed to the next middleware
  if (validRoute === destination) return NextResponse.next();

  return NextResponse.redirect(new URL(validRoute, request.url));
}

// eslint-disable-next-line import/group-exports -- The config only works when exported first.
export { middleware };
