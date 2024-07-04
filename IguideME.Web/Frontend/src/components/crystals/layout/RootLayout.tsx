import { getSelf } from '@/api/users';
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import { UserRoles } from '@/types/user';
import {
  CompassOutlined,
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
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
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
            className='!bg-surface1 max-h-screen overflow-y-auto border-r-0 [&>div]:flex [&>div]:flex-grow [&>div]:flex-col'
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
                <div className='w-10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    shapeRendering='geometricPrecision'
                    textRendering='geometricPrecision'
                    version='1.1'
                    viewBox='0 0 543 451'
                  >
                    <path
                      fill='#000'
                      fillOpacity='1'
                      stroke='#fff'
                      strokeDasharray='none'
                      strokeWidth='0'
                      d='M100.017 266.122v91.977l169.282 85.122 169.283-85.122v-91.977L269.3 356.182'
                    ></path>
                    <path
                      fill='#000'
                      fillOpacity='1'
                      stroke='#fff'
                      strokeDasharray='none'
                      strokeWidth='0'
                      d='M540.218 152.148L269.3 4.558 5.682 152.147l263.617 140.38 223.68-121.52 10.109 7.833v164.513l37.13-.043'
                    ></path>
                  </svg>
                </div>
              : <div className='w-50'>
                  <svg
                    id='e13h8ylUAWB1'
                    viewBox='0 0 171.567 44.055'
                    shapeRendering='geometricPrecision'
                    textRendering='geometricPrecision'
                    xmlSpace='preserve'
                    width={171.567}
                    height={44.055}
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <text
                      dx={0}
                      dy={0}
                      fontFamily="'e13h8ylUAWB1:::Roboto'"
                      fontSize={36.275}
                      fontWeight={700}
                      strokeWidth={0}
                      id='text2'
                      x={-1.161}
                      y={35.349}
                    >
                      <tspan y={35.349} fontWeight={700} strokeWidth={0} id='tspan1' />
                    </text>
                    <style id='style3'>
                      {
                        '@font-face{font-family:"e13h8ylUAWB1:::Roboto";font-style:normal;font-weight:700;src:url(data:font/ttf;charset=utf-8;base64,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)format("truetype")}'
                      }
                    </style>
                    <g
                      style={{
                        shapeRendering: 'geometricPrecision',
                        textRendering: 'geometricPrecision',
                      }}
                      id='g3'
                      transform='matrix(.07901 0 0 .08241 111.74 -.376)'
                    >
                      <path
                        style={{
                          fill: '#000',
                          fillOpacity: 1,
                          stroke: '#fff',
                          strokeWidth: 0,
                          strokeDasharray: 'none',
                        }}
                        d='M100.017 266.122v91.977l169.282 85.122 169.283-85.122v-91.977L269.3 356.182'
                        id='path2'
                      />
                      <path
                        style={{
                          fill: '#000',
                          fillOpacity: 1,
                          stroke: '#fff',
                          strokeWidth: 0,
                          strokeDasharray: 'none',
                        }}
                        d='M540.218 152.148 269.3 4.558 5.682 152.147l263.617 140.38 223.68-121.52 10.109 7.833v164.513l37.13-.043'
                        id='path1'
                      />
                    </g>
                  </svg>
                </div>
              }
            </div>
            <SideNavigation />
          </AntLayout.Sider>

          <AntLayout className='bg-surface2'>
            <Breadcrumb
              className='[&_li]:!text-text [&_span]:text-text my-2 ml-6'
              items={crumbs.map((breadcrumb) => ({
                title: (
                  <Link className='!text-text' to={breadcrumb.href}>
                    {breadcrumb.label}
                  </Link>
                ),
              }))}
            />
            <AntLayout.Content className='bg-surface1 relative mx-6 mb-6 overflow-auto rounded-lg'>
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
      <div className='border-b-text mb-1 flex flex-col items-center border-b border-solid px-4 py-2'>
        {isSidebarClosed ?
          <UserOutlined className='text-text' />
        : <>
            <h3 className='self-start overflow-hidden text-ellipsis whitespace-nowrap text-lg'>{self.name}</h3>
            <strong className='text-text self-start'>
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
            </>
          )}
        </ul>
        <ul className='flex flex-col gap-2'>
          <li className={`flex gap-2 ${isSidebarClosed && '!h-24 flex-col'} flex-grow`}>
            <div
              className={`grid h-11 flex-1 place-content-center rounded-md ${!isSidebarClosed && 'border-border1 border'}`}
            >
              <ThemeSwitcher user={self} variant='compact' />
            </div>
            <div className={`h-11 flex-1 rounded-md ${!isSidebarClosed && 'border-border1 border'} text-text p-0`}>
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
              onClick={() => {
                toggleSidebar();
              }}
              type='text'
            >
              {isSidebarClosed ?
                <MenuUnfoldOutlined className='text-text col-span-4' />
              : <div className='col-span-4 grid h-full w-full grid-cols-4 items-center'>
                  <MenuFoldOutlined className='text-text col-span-1 !grid h-full w-full place-content-center' />
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
          `hover:bg-surface2/50 active:bg-surface2/50 grid h-full w-full grid-cols-4 items-center rounded-md transition-colors ${
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
          className={`${isSidebarClosed ? 'col-span-4' : 'col-span-1'} text-text grid h-full w-full place-content-center`}
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
  const [open, setOpen] = useState<boolean>(false);

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
            className={`${isSidebarClosed ? 'flex' : 'grid grid-cols-4'} hover:bg-surface2/50 mb-2 h-11 w-full items-center rounded-md transition-colors ${props.activeOverride ? 'bg-surface2' : ''}`}
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <props.Icon className='text-text col-span-1 grid h-full w-full place-content-center' />
            {!isSidebarClosed && <p className='col-span-2 text-left'>{props.label}</p>}
            {open ?
              <UpOutlined className='text-text col-span-1 grid h-full w-full place-content-center' />
            : <DownOutlined className='text-text col-span-1 grid h-full w-full place-content-center' />}
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
