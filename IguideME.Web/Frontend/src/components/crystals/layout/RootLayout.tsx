import { getSelf } from '@/api/users';
import Hat from '@/components/atoms/logo/Hat';
import Logo from '@/components/atoms/logo/Logo';
import { UserRoles } from '@/types/user';
import {
  CompassOutlined,
  ControlOutlined,
  DashboardOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Layout as AntLayout, Breadcrumb, Button } from 'antd';
import { type ElementType, type FC, memo, type ReactElement, Suspense, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useMatches, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import GlobalStoreProvider from './GlobalStore/globalStore';
import { useGlobalContext } from './GlobalStore/useGlobalStore';
import { useLayoutStore } from './LayoutStore';
import { getAdminPanelMenuItems } from './adminPanelMenuItems';

interface Match {
  id: string;
  pathname: string;
  params: Record<string, string>;
  data?: unknown;
  handle: {
    crumb: (data: unknown, params: Record<string, string>) => Array<{ href: string; label: string }>;
  };
}

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
            className='max-h-screen overflow-y-auto border-r-0 !bg-surface1 [&>div]:flex [&>div]:flex-grow [&>div]:flex-col'
            collapsed={isSidebarClosed}
            collapsedWidth={60}
            collapsible
            onCollapse={() => {
              toggleSidebar();
            }}
            trigger={null}
          >
            <div className='grid place-content-center p-4'>
              {isSidebarClosed ?
                <Hat width='100%' />
              : <Logo width='100%' />}
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
            <AntLayout.Content className='relative ml-1 overflow-auto rounded-lg bg-surface1 md:mx-6 md:mb-6'>
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

  const path = useLocation().pathname;

  return (
    <>
      <div className='mb-1 flex flex-col items-center border-b border-solid border-b-text px-4 py-2'>
        {isSidebarClosed ?
          <UserOutlined className='text-text' />
        : <>
            <h3 className='self-start overflow-hidden text-ellipsis whitespace-nowrap text-lg'>{self.name}</h3>
            <strong className='self-start text-text'>
              <UserOutlined className='text-text' /> {['Student', 'Instructor'][self.role]}
            </strong>
          </>
        }
      </div>

      <div className='flex flex-grow flex-col justify-between px-2 pb-6 [&_li]:h-11 [&_li]:w-full'>
        <ul className='flex flex-col gap-2'>
          <SideNavigationLink to='/' Icon={CompassOutlined} label='Select Course' />
          {courseId && (
            <>
              <SideNavigationLink
                activeOverride={path === `/${courseId}`}
                to={`/${courseId}${self.role === UserRoles.student ? `/${self.userID}` : ''}`}
                Icon={self.role === UserRoles.student ? DashboardOutlined : SearchOutlined}
                label={self.role === UserRoles.student ? 'Dashboard' : 'Select Student'}
              />
              {self.role === UserRoles.instructor && (
                <>
                  {(() => {
                    const adminPanelMenuItems = getAdminPanelMenuItems(courseId, path);
                    return (
                      <SideNavigationDropdown
                        activeOverride={path.startsWith(`/${courseId}/admin`)}
                        Icon={DashboardOutlined}
                        label='Admin Panel'
                        to={`/${courseId}/admin/admin-panel`}
                        items={adminPanelMenuItems}
                      />
                    );
                  })()}
                </>
              )}
              {self.role === UserRoles.student && (
                <SideNavigationLink
                  activeOverride={path.startsWith(`/${courseId}/student`)}
                  to={`/${courseId}/${self.userID}/settings`}
                  Icon={ControlOutlined}
                  label='Settings'
                />
              )}
            </>
          )}
        </ul>
        <ul className='flex flex-col gap-2'>
          <li>
            <Button
              className='grid h-full w-full grid-cols-4 items-center p-0'
              onClick={() => {
                toggleSidebar();
              }}
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

export interface SideNavigationLinkProps {
  activeOverride?: boolean;
  to: string;
  Icon: ElementType;
  label: string;
}

const SideNavigationLink: FC<SideNavigationLinkProps> = memo(({ activeOverride, to, Icon, label }): ReactElement => {
  const { isSidebarClosed } = useLayoutStore(useShallow((state) => ({ isSidebarClosed: state.isSidebarClosed })));

  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          `grid h-full w-full grid-cols-4 items-center rounded-md transition-colors hover:bg-surface2/50 active:bg-surface2/50 ${
            typeof activeOverride !== 'undefined' ?
              activeOverride ? 'bg-surface2'
              : ''
            : isActive ? 'bg-surface2'
            : ''
          }`
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

interface SideNavigationDropdownProps extends SideNavigationLinkProps {
  items?: SideNavigationDropdownProps[];
}

const SideNavigationDropdown: FC<SideNavigationDropdownProps> = memo(({ items, ...props }): ReactElement => {
  const [open, setOpen] = useState<boolean>(true);

  const { isSidebarClosed } = useLayoutStore(useShallow((state) => ({ isSidebarClosed: state.isSidebarClosed })));
  const height =
    open ?
      items ? 44 * items.length + 44 + 8 * items.length
      : 44
    : 44;

  return (
    <li style={{ height }}>
      {items ?
        <>
          <button
            className={`${isSidebarClosed ? 'flex' : 'grid grid-cols-4'} mb-2 h-11 w-full items-center rounded-md transition-colors hover:bg-surface2/50 ${props.activeOverride ? 'bg-surface2' : ''}`}
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <props.Icon className='col-span-1 grid h-full w-full place-content-center text-text' />
            {!isSidebarClosed && <p className='col-span-2 text-left'>{props.label}</p>}
            {open ?
              <UpOutlined className='col-span-1 grid h-full w-full place-content-center text-text' />
            : <DownOutlined className='col-span-1 grid h-full w-full place-content-center text-text' />}
          </button>

          {open && (
            <ul className={`flex flex-col gap-2 ${!isSidebarClosed && 'pl-4'}`}>
              {items.map((child) => (
                <SideNavigationDropdown key={child.label} {...child} />
              ))}
            </ul>
          )}
        </>
      : <SideNavigationLink {...props} />}
    </li>
  );
});
SideNavigationDropdown.displayName = 'SideNavigationDropdown';
