import { SmileTwoTone } from '@ant-design/icons';
import { useTileViewStore } from '@/components/pages/student-dashboard/tileViewContext';
import { type FC, type ReactElement } from 'react';

const StudentInfo: FC = (): ReactElement => {
  const { user } = useTileViewStore((state) => ({
    user: state.user,
  }));

  return (
    <div className='flex gap-2'>
      <SmileTwoTone className='text-4xl' twoToneColor='#00cc66' />
      <div className='text-xs h-9 grid place-content-center'>
        <p>
          {user.name}
          <br />
          {user.userID}
        </p>
      </div>
    </div>
  );
};

export default StudentInfo;
