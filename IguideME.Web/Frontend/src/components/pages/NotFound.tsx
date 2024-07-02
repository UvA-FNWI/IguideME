import { Button, Result } from 'antd';
import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = (): ReactElement => {
  return (
    <Result
      className='[&_div]:!text-text'
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button
          className='m-0 h-11 !w-60 border border-accent/70 bg-accent/20 text-text hover:!border-accent hover:!bg-accent hover:!text-text'
          type='primary'
        >
          <Link to='/'>Back Home</Link>
        </Button>
      }
    />
  );
};
NotFound.displayName = 'NotFound';
export default NotFound;
