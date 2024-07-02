import { getSelf } from '@/api/users';
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import { UserRoles } from '@/types/user';
import {
  CompassOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Layout as AntLayout, Breadcrumb, Button } from 'antd';
import { ElementType, memo, Suspense, type FC, type ReactElement } from 'react';
import { Link, NavLink, Outlet, useMatches, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import GlobalStoreProvider from './GlobalStore/globalStore';
import { useGlobalContext } from './GlobalStore/useGlobalStore';
import { useLayoutStore } from './LayoutStore';

type Match = {
  id: string;
  pathname: string;
  params: { [key: string]: string };
  data?: unknown;
  handle: {
    crumb: (data: unknown, params: { [key: string]: string }) => { href: string; label: string }[];
  };
};

const Layout: FC = (): ReactElement => {
  const { data: self } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  const { isSidebarClosed, toggleSidebar } = useLayoutStore(
    useShallow((state) => ({
      isSidebarClosed: state.isSidebarClosed,
      toggleSidebar: state.toggleSidebar,
    })),
  );

  const matches = useMatches() as Match[];
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.data, match.params))
    .flat();

  if (!self) return <></>;

  return (
    <GlobalStoreProvider self={self}>
      <AntLayout className='h-screen'>
        <AntLayout>
          <AntLayout.Sider
            breakpoint='lg'
            className='border-r-0 !bg-surface1 [&>div]:flex [&>div]:flex-grow [&>div]:flex-col'
            collapsed={isSidebarClosed}
            collapsedWidth={60}
            collapsible
            onCollapse={() => toggleSidebar()}
            trigger={null}
          >
            <div className='grid place-content-center p-4'>
              {isSidebarClosed ?
                <SmileOutlined className='text-2xl !text-primary' />
              : <p className='text-2xl font-bold'>IguideME</p>}
            </div>
            <SideNavigation />
          </AntLayout.Sider>

          <AntLayout className='bg-surface2'>
            <Breadcrumb
              className='my-2 ml-6 [&_li]:!text-text [&_span]:text-text'
              items={crumbs.map((breadcrumb) => ({
                title: (
                  <Link className='!text-text' to={breadcrumb.href}>
                    {breadcrumb.label}
                  </Link>
                ),
              }))}
            />
            <AntLayout.Content className='relative mx-6 mb-6 overflow-auto rounded-lg bg-surface1'>
              <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
              </Suspense>
            </AntLayout.Content>
          </AntLayout>
        </AntLayout>
      </AntLayout>
    </GlobalStoreProvider>
  );
};
Layout.displayName = 'Layout';
export default Layout;

const SideNavigation: FC = (): ReactElement => {
  const { courseId } = useParams();
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  const { isSidebarClosed, toggleSidebar } = useLayoutStore(
    useShallow((state) => ({
      isSidebarClosed: state.isSidebarClosed,
      toggleSidebar: state.toggleSidebar,
    })),
  );

  return (
    <>
      <div className='mb-1 flex flex-col items-center border-b border-solid border-b-text px-4 py-2'>
        {isSidebarClosed ?
          <UserOutlined className='text-text' />
        : <>
            <h3 className='self-start overflow-hidden text-ellipsis whitespace-nowrap text-lg'>
              {self ? self.name : ''}
            </h3>
            <strong className='self-start text-text'>
              <UserOutlined className='text-text' /> {self ? ['Student', 'Instructor'][self.role] : ''}
            </strong>
          </>
        }
      </div>

      <div className='flex flex-grow flex-col justify-between px-2 pb-6 [&_li]:h-11 [&_li]:w-full'>
        <ul className='flex flex-col gap-2'>
          <SideNavigationLink to='/' Icon={CompassOutlined} label='Select Course' isSidebarClosed={isSidebarClosed} />
          {courseId && (
            <>
              <SideNavigationLink
                to={`/${courseId}${self.role === UserRoles.student ? `/${self.userID}` : ''}`}
                Icon={self.role === UserRoles.student ? DashboardOutlined : SearchOutlined}
                label={self.role === UserRoles.student ? 'Dashboard' : 'Select Student'}
                isSidebarClosed={isSidebarClosed}
              />
              {self.role === UserRoles.instructor && (
                <SideNavigationLink
                  to={`/${courseId}/admin/admin-panel`}
                  Icon={DashboardOutlined}
                  label='Admin Dashboard'
                  isSidebarClosed={isSidebarClosed}
                />
              )}
            </>
          )}
        </ul>
        <ul className='flex flex-col gap-2'>
          <li className={`flex gap-2 ${isSidebarClosed && '!h-24 flex-col'} flex-grow`}>
            <div
              className={`grid h-11 flex-1 place-content-center rounded-md ${!isSidebarClosed && 'border border-border1'}`}
            >
              <ThemeSwitcher user={self} variant='compact' />
            </div>
            <div className={`h-11 flex-1 rounded-md ${!isSidebarClosed && 'border border-border1'} p-0 text-text`}>
              <NotificationPanel
                buttonClasses='w-full border-none h-full !text-text hover:!text-subtext0'
                placement='right'
                user={self.role === UserRoles.student ? self : null}
              />
            </div>
          </li>
          <li>
            <Button
              className='grid h-full w-full grid-cols-4 items-center p-0'
              onClick={() => toggleSidebar()}
              type='text'
            >
              {isSidebarClosed ?
                <MenuUnfoldOutlined className='col-span-4 text-text' />
              : <div className='col-span-4 grid h-full w-full grid-cols-4 items-center'>
                  <MenuFoldOutlined className='col-span-1 !grid h-full w-full place-content-center text-text' />
                  <p className='col-span-3 text-left'>Minimize</p>
                </div>
              }
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};
SideNavigation.displayName = 'SideNavigation';

type SideNavigationLinkProps = {
  to: string;
  Icon: ElementType;
  label: string;
  isSidebarClosed: boolean;
};

const SideNavigationLink: FC<SideNavigationLinkProps> = memo(({ to, Icon, label, isSidebarClosed }): ReactElement => {
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          `grid h-full w-full grid-cols-4 items-center rounded-md transition-colors hover:bg-surface2/50 active:bg-surface2/50 ${isActive ? 'bg-surface2' : ''}`
        }
        to={to}
      >
        <Icon
          className={`${isSidebarClosed ? 'col-span-4' : 'col-span-1'} grid h-full w-full place-content-center text-text`}
        />
        {isSidebarClosed ? null : <p className='col-span-3 text-left'>{label}</p>}
      </NavLink>
    </li>
  );
});
SideNavigationLink.displayName = 'SideNavigationLink';
