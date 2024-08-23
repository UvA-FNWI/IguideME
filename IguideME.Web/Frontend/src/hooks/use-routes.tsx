'use client';

import type { ElementType } from 'react';
import {
  BarChartBig,
  CandlestickChart,
  Compass,
  DatabaseZap,
  GalleryVerticalEnd,
  Gauge,
  Grid2x2Check,
  LineChart,
  Search,
  SlidersVertical,
  Trophy,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { useGlobalContext } from '@/stores/global-store/use-global-store';
import { UserRoles } from '@/types/user';

export interface Route {
  href: string;
  icon: ElementType;
  label: string;
  routeType: UserRoles | 'public';
  subRoutes?: Route[];
  status: 'active' | 'inactive' | 'disabled';
  whenAvailable?: string;
}

export const useRoutes = (): Route[] => {
  const pathname = usePathname();
  const { course, self, student } = useGlobalContext(
    useShallow((state) => ({ course: state.course, self: state.self, student: state.student })),
  );

  return [
    {
      href: '/',
      icon: Compass,
      label: 'Select Course',
      routeType: 'public',
      status: pathname === '/' ? 'active' : 'inactive',
    },
    {
      href: `/courses/${String(course?.id)}`,
      icon: Search,
      label: 'Select Student',
      routeType: UserRoles.Instructor,
      status:
        course ?
          pathname === `/courses/${String(course.id)}` ?
            'active'
          : 'inactive'
        : 'disabled',
      whenAvailable: 'Please select a course to view students',
    },
    {
      href: `/courses/${String(course?.id)}/students/${String(student?.userID)}`,
      icon: CandlestickChart,
      label:
        self.role === UserRoles.Instructor ?
          `${student ? `${String(student.name.split(' ')[0])}'s` : 'Student'} Dashboard`
        : 'My Dashboard',
      routeType: 'public',
      status:
        course && student ?
          pathname === `/courses/${String(course.id)}/students/${String(student.userID)}` ?
            'active'
          : 'inactive'
        : 'disabled',
      whenAvailable:
        self.role === UserRoles.Instructor ?
          'Please select a student to view their dashboard'
        : 'Please select a course to view your dashboard',
    },
    {
      href: `/courses/${String(course?.id)}/students/${String(student?.userID)}/settings`,
      icon: SlidersVertical,
      label: 'Settings',
      routeType: UserRoles.Student,
      status:
        course && student ?
          pathname === `/courses/${String(course.id)}/students/${String(student.userID)}/settings` ?
            'active'
          : 'inactive'
        : 'disabled',
      whenAvailable: 'Please select a course to view your course related settings',
    },
    {
      href: `/courses/${String(course?.id)}/admin`,
      icon: Gauge,
      label: 'Admin Panel',
      routeType: UserRoles.Instructor,
      subRoutes: [
        {
          href: `/courses/${String(course?.id)}/admin/sync`,
          icon: DatabaseZap,
          label: 'Sync Management',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/sync` ? 'active' : 'inactive',
        },
        {
          href: `/courses/${String(course?.id)}/admin/tiles`,
          icon: Grid2x2Check,
          label: 'Tiles',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/tiles` ? 'active' : 'inactive',
        },
        {
          href: `/courses/${String(course?.id)}/admin/learning-goals`,
          icon: Trophy,
          label: 'Learning Goals',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/learning-goals` ? 'active' : 'inactive',
        },
        {
          href: `/courses/${String(course?.id)}/admin/layout`,
          icon: GalleryVerticalEnd,
          label: 'Layout',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/layout` ? 'active' : 'inactive',
        },
        // {
        //   href: `/courses/${String(course?.id)}/admin/data-wizard`,
        //   icon: CloudUpload,
        //   label: 'Data Wizard',
        //   routeType: UserRoles.Instructor,
        //   status: pathname === `/courses/${String(course?.id)}/admin/data-wizard` ? 'active' : 'inactive',
        // },
        {
          href: `/courses/${String(course?.id)}/admin/student-overview`,
          icon: Users,
          label: 'Student Overview',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/student-overview` ? 'active' : 'inactive',
        },
        // TODO: Add these routes when they are implemented
        // {
        //   href: `/courses/${String(course?.id)}/admin/grade-predictor`,
        //   icon: BrainCircuit,
        //   label: 'Grade Predictor',
        //   routeType: UserRoles.Instructor,
        //   status: pathname === `/courses/${String(course?.id)}/admin/grade-predictor` ? 'active' : 'inactive',
        // },
        {
          href: `/courses/${String(course?.id)}/admin/grade-analyzer`,
          icon: LineChart,
          label: 'Grade Analyzer',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/grade-analyzer` ? 'active' : 'inactive',
        },
        {
          href: `/courses/${String(course?.id)}/admin/usage-analytics`,
          icon: BarChartBig,
          label: 'Usage Analytics',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/usage-analytics` ? 'active' : 'inactive',
        },
        {
          href: `/courses/${String(course?.id)}/admin/settings`,
          icon: SlidersVertical,
          label: 'Settings',
          routeType: UserRoles.Instructor,
          status: pathname === `/courses/${String(course?.id)}/admin/settings` ? 'active' : 'inactive',
        },
      ],
      status:
        course ?
          pathname === `/courses/${String(course.id)}/admin` ?
            'active'
          : 'inactive'
        : 'disabled',
      whenAvailable: 'Please select a course to view the admin panel',
    },
  ];
};
