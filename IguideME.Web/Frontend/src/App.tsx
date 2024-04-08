import Header from '@/components/crystals/header/header';
import Loading from './components/particles/loading';
import { getSelf } from './api/users';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserRoles } from './types/user';
import { useEffect, type ReactElement } from 'react';

/**
 * The main entry point to the app. Adds a header and the contents of the app
 * will be shown in Outlet, depending on the route.
 * @returns {React.ReactElement} The app.
 */
function App(): ReactElement {
  const navigate = useNavigate();

  // Get the current user from the backend and updates the route if the user is a student.
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,

    // Since the user data is sensitive and important for all pages, we want to always refetch it.
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isSuccess && data.role === UserRoles.student) {
      navigate(data.userID ?? '/');
    }
  }, [isSuccess]);

  const HeaderLoader = (
    <header className='h-header bg-primary-purple flex justify-between items-center px-4'>
      <p className='text-white align-middle font-semibold inline-block text-2xl'>IguideME</p>
    </header>
  );

  if (isLoading) {
    return (
      <>
        {HeaderLoader}
        <div className='h-[calc(100vh-70px)] bg-white grid items-center'>
          <Loading />
        </div>
      </>
    );
  } else if (isError || data === undefined) {
    return (
      <>
        {HeaderLoader}
        <div className='h-[calc(100vh-70px)] bg-white flex flex-col items-center justify-center text-justify gap-2'>
          <h1 className='w-full text-2xl max-w-lg tracking-normal'>
            {isError ? 'Something unexpected happened' : "Unfortunately, we couldn't find your account."}
          </h1>
          <p className='w-full max-w-lg'>
            {isError ?
              'Please try again later. If this problem persists, please contact the support team.'
            : 'If you believe this is an error, please contact your instructor or the support team. If you are an instructor, please make sure that you have registered your course on the platform.'
            }
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header self={data} />
      <Outlet />
    </>
  );
}

export default App;
