import { cn } from '@/utils/cn';
import { getStudents } from '@/api/users';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { type Dispatch, type FC, type ReactElement, type SetStateAction, useEffect } from 'react';
import { type User } from '@/types/user';

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
        'w-full md:w-80 lg:w-[400px] h-[40px] [&>div]:!bg-navbarBackground [&>div]:!border-white [&>div>span]:!text-white [&_span_*]:!text-white',
        selectClasses,
      )}
      popupClassName='!bg-dropdownBackground [&>div>div>div>div>div>div>div]:!text-text styles.custom-hover selectBackgroundHover'
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
