import { type FC, type ReactElement } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage: FC = (): ReactElement => {
  const error = useRouteError();

  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    // @ts-expect-error - The error object is a RouteErrorResponse
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error message';
  }

  return (
    <div id='error-page' className='flex h-screen flex-col items-center justify-center gap-8'>
      <h1 className='text-4xl font-bold'>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className='text-slate-400'>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
};
export default ErrorPage;
