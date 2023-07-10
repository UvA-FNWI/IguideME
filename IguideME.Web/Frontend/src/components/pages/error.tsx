import { FC, ReactElement } from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

const ErrorPage: FC = (): ReactElement => {
    // you don't need to explicitly set error to `unknown`
    const error = useRouteError()

    return (
        <div className='Error'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>
                    {
                        isRouteErrorResponse(error) ?
                            (
                                // note that error is type `ErrorResponse`
                                error.error?.message || error.statusText
                            ) :
                            'Unknown error message'
                    }
                </i>
            </p>
        </div>
    )
}

export default ErrorPage
