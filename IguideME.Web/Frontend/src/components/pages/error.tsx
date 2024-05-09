import { type FC, type ReactElement } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage: FC = (): ReactElement => {
  const error = useRouteError();

  return (
    <div id='error-page' className='flex h-screen flex-col items-center justify-center gap-8'>
      <h1 className='text-4xl font-bold'>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className='text-slate-400'>
        <i>
          {isRouteErrorResponse(error) ?
            // note that error is type `ErrorResponse`
            error.error?.message || error.statusText
          : 'Unknown error message'}
        </i>
      </p>
    </div>
  );
};
export default ErrorPage;
