import { getStudents } from '@/api/users';
import { type User } from '@/types/user';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { type Dispatch, type FC, type ReactElement, type SetStateAction, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface SelectorProps {
  /** The placeholder text for the select component. */
  placeholder?: string;
  /** Function to call when a student is selected. */
  onSelect?: () => void;
  /** The classes to apply to the select component. */
  selectClasses?: string;
  /** The currently selected student by the instructor. */
  selectedStudent: User | undefined;
  /** Function to set the selected student. */
  setSelectedStudent: Dispatch<SetStateAction<User | undefined>>;
}

/**
 * Helper function for the student selector component.
 * @returns {React.ReactElement} The student selector
 */
const Selector: FC<SelectorProps> = ({
  placeholder = 'Choose a student',
  onSelect,
  selectClasses,
  selectedStudent,
  setSelectedStudent,
}): ReactElement => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      setSelectedStudent(data?.find((student) => student.userID === id));
    }
  }, [id, data]);

  const students = data
    ?.sort((a, b) => a.sortable_name.localeCompare(b.sortable_name))
    .filter((student) => student.userID !== selectedStudent?.userID);

  const changeStudent = (userID: string): void => {
    if (userID) {
      onSelect && onSelect();
      setSelectedStudent(students?.find((student) => student.userID === userID));
      navigate(userID ?? '/');
    } else {
      setSelectedStudent(undefined);
    }
  };

  return (
    <Select
      allowClear={true}
      aria-disabled={isLoading || isError}
      className={cn(
        'h-[40px] w-full md:w-80 lg:w-[400px] [&>div>span]:!text-white [&>div]:!border-white [&>div]:!bg-navbar [&_span_*]:!text-white',
        selectClasses,
      )}
      popupClassName='!bg-dropdownBackground [&>div>div>div>div>div>div>div]:!text-text selectBackgroundHover'
      disabled={isLoading || isError}
      placeholder={
        isLoading ? 'Loading students...'
        : isError ?
          'Error loading students'
        : placeholder
      }
      onChange={changeStudent}
      optionFilterProp='label'
      options={students?.map((student) => ({
        label: student.name,
        value: student.userID,
      }))}
      showSearch={true}
      value={selectedStudent ? selectedStudent.name : null}
    />
  );
};
export default Selector;
