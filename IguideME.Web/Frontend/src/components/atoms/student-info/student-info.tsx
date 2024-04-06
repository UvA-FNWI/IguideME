import { SmileTwoTone } from '@ant-design/icons';
import type { User } from '@/types/user';
import { type FC, type ReactElement } from 'react';

interface Props {
  self: User;
}

const StudentInfo: FC<Props> = ({ self }): ReactElement => {
  return (
    <div className="flex gap-2">
      <SmileTwoTone className="text-4xl" twoToneColor="#00cc66" />
      <div className="text-xs h-9 grid place-content-center">
        <p>
          {self?.name}
          <br />
          {self?.userID}
        </p>
      </div>
    </div>
  );
};

export default StudentInfo;
