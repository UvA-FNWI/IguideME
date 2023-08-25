import { FC, ReactElement } from 'react';

import './style.scss';
import { Divider } from 'antd';

type Props = {
    title: string;
    description: ReactElement | string;
}

const AdminTitle: FC<Props> = ({title, description}): ReactElement => {
  return (
    <div>

      <div className='AdminTitle'>
        <h1>{title}</h1>
        <div>{description}</div>

      </div>
        <Divider style={{ margin: '5px 0 20px 0' }} />
    </div>

  )
}

export default AdminTitle
