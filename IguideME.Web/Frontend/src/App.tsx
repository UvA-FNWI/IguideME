import Header from '@/components/crystals/header/header';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, type ReactElement } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { getSelf } from './api/users';
import Loading from './components/particles/loading';
import { UserRoles } from './types/user';

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
    // TODO: If data is null or undefined print an error message. The backend needs one synchronize before data can be fetched.
    if (isSuccess && data.role === UserRoles.student) {
      navigate(data.userID ?? '/');
    }
  }, [isSuccess]);

  const HeaderLoader = (
    <header className='flex h-header items-center justify-start bg-navbar p-3'>
      <p className='inline-block align-middle text-2xl font-semibold text-white'>IguideME</p>
    </header>
  );

  const GlobalLoadingState = (
    <>
      {HeaderLoader}
      <div className='grid h-[calc(100vh-70px)] items-center bg-body'>
        <Loading />
      </div>
    </>
  );

  if (isLoading) return GlobalLoadingState;
  else if (isError || data === undefined) {
    return (
      <Suspense fallback={GlobalLoadingState}>
        {HeaderLoader}
        <div className='flex h-[calc(100vh-70px)] flex-col items-center justify-center gap-2 bg-body text-justify'>
          <h1 className='w-full max-w-lg text-2xl tracking-normal'>
            {isError ? 'Something unexpected happened' : "Unfortunately, we couldn't find your account."}
          </h1>
          <p className='w-full max-w-lg'>
            {isError ?
              'Please try again later. If this problem persists, please contact the support team.'
            : 'If you believe this is an error, please contact your instructor or the support team. If you are an instructor, please make sure that you have registered your course on the platform.'
            }
          </p>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={GlobalLoadingState}>
      <Toaster richColors />
      <Header self={data} />
      <Outlet />
    </Suspense>
  );
}

export default App;
