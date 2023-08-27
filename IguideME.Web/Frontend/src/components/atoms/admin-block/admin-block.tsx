import { Divider } from 'antd';
import './style.scss';

import { FC, ReactElement } from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
  }

const AdminBlock: FC<Props> = ({title, children}): ReactElement => {

  return (
    <div className='settingBlock'>
        <h2>{title}</h2>
        <Divider style={{ margin:'5px 0px 8px 0px' }} />
        {children}
    </div>

  )
}

export default AdminBlock
