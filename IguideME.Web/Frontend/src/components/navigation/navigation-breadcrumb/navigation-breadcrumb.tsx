'use client';

import { type FC, memo, type ReactElement, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { getCourseById } from '@/api/course';
import { getTile } from '@/api/tiles';
import { getStudent } from '@/api/users';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { useGlobalContext } from '@/stores/global-store/use-global-store';
import { UserRoles } from '@/types/user';

import { NavigationBreadcrumbItems } from './navigation-breadcrumb-items';

interface BreadcrumbPart {
  /** Display name of the breadcrumb part. */
  name: string;
  /** Path URL of the breadcrumb part. */
  path: string;
}

const NavigationBreadcrumb: FC<{ className?: string }> = memo(({ className }): ReactElement => {
  const pathname = usePathname();
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  // Extract course and student IDs from the URL path.
  const [courseId, studentId, tileId] = useMemo(() => {
    const parts = pathname.split('/');
    // Both course and student IDs are numeric.
    const cid = parts.find((part) => /^\d+$/.test(part));
    const sid = parts.find((part, index) => /^\d+$/.test(part) && cid && index > parts.indexOf(cid)); // Ensure sid comes after cid
    const tid = parts.find((part, index) => /^\d+$/.test(part) && sid && index > parts.indexOf(sid)); // Ensure tid comes after sid
    return [cid, sid, tid];
  }, [pathname]);

  const {
    data: course,
    isError: courseError,
    isLoading: courseLoading,
  } = useQuery({ queryKey: [courseId], queryFn: () => getCourseById(courseId) });

  const {
    data: student,
    isError: studentError,
    isLoading: studentLoading,
  } = useQuery({ queryKey: [studentId], queryFn: () => getStudent(studentId) });

  const {
    data: tile,
    isError: tileError,
    isLoading: tileLoading,
  } = useQuery({ queryKey: [tileId], queryFn: () => getTile(tileId) });

  // Compute breadcrumb parts based on the current URL path.
  const breadcrumbParts: BreadcrumbPart[] = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean); // Remove empty parts
    const breadcrumbs: BreadcrumbPart[] = [{ name: 'Home', path: '/' }]; // Home is always the first breadcrumb

    parts.forEach((part, index) => {
      let name = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      let path = `/${parts.slice(0, index + 1).join('/')}`;

      if (part === 'courses' && courseId) {
        name = course?.name ?? 'Course';
        path = `/courses/${String(courseId)}`;
      } else if (part === 'students' && studentId) {
        name =
          student ?
            self.role === UserRoles.Student ?
              'My Dashboard'
            : `${String(student.name.split(' ')[0])}'s Dashboard`
          : 'Student Dashboard';
        path = `/courses/${String(courseId)}/students/${String(studentId)}`;
      } else if (part === 'tiles' && tileId) {
        name = tile?.title ?? 'Tile';
        path = `/courses/${String(courseId)}/students/${String(studentId)}/tiles/${String(tileId)}`;
      } else if (part === 'admin') {
        name = 'Admin Panel';
        path = `/courses/${String(courseId)}/admin/sync`;
      } else if (/^\d+$/.test(part)) {
        // Skip numeric parts
        return;
      }

      breadcrumbs.push({ name, path });
    });

    return breadcrumbs;
  }, [course?.name, courseId, pathname, self.role, student, studentId, tile?.title, tileId]);

  const { changeCourse, changeStudent } = useGlobalContext(
    useShallow((state) => ({
      changeCourse: state.changeCourse,
      changeStudent: state.changeStudent,
    })),
  );

  useEffect(() => {
    if (course) changeCourse(course);
    if (student) changeStudent(student);
  }, [changeCourse, course, changeStudent, student]);

  const isError = courseError || studentError || tileError;
  const isLoading = courseLoading || studentLoading || tileLoading;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <NavigationBreadcrumbItems items={breadcrumbParts} isLoading={isLoading} isError={isError} />
      </BreadcrumbList>
    </Breadcrumb>
  );
});
NavigationBreadcrumb.displayName = 'NavigationBreadcrumb';

export type { BreadcrumbPart };
export { NavigationBreadcrumb };
