import { getAcceptedStudents, postAcceptedStudents } from '@/api/student_settings';
import { getStudentsWithSettings } from '@/api/users';
import type { User } from '@/types/user';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Col, Divider, Row, Space, Switch } from 'antd';
import { useEffect, useState, type FC, type ReactElement } from 'react';
import Swal from 'sweetalert2';

function isObjectInArray(obj: User, array: User[]): boolean {
  return array.some((item) => item.userID === obj.userID);
}

const AcceptListSettings: FC = (): ReactElement => {
  const {
    data: students,
    isError: studentError,
    isLoading: studentLoading,
  } = useQuery({ queryKey: ['students', 'settings'], queryFn: getStudentsWithSettings });
  const {
    data: acceptedStudentsData,
    isError: acceptedError,
    isLoading: acceptedLoading,
  } = useQuery({ queryKey: ['acceptedStudents'], queryFn: getAcceptedStudents });

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const {
    mutate: setAcceptedStudentsRoute,
    isPending,
    status,
  } = useMutation({
    mutationFn: postAcceptedStudents,

    onMutate: () => {
      void message.open({
        key: 'accepted',
        type: 'loading',
        content: 'Saving accepted students...',
      });
    },

    onError: () => {
      void message.open({
        key: 'accepted',
        type: 'error',
        content: 'Error saving accepted students',
        duration: 3,
      });
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['acceptedStudents'] });

      void message.open({
        key: 'accepted',
        type: 'success',
        content: 'Accepted students saved successfully',
        duration: 3,
      });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      void Swal.fire('Success', 'The configuration has been set.', 'success');
    } else if (status === 'error') {
      void Swal.fire('Error', 'Failed to update the configuration.', 'error');
    }
  }, [status]);

  const [acceptedStudents, setAcceptedStudents] = useState<User[]>([]);
  useEffect(() => {
    if (acceptedStudentsData) {
      const _acceptedStudents = acceptedStudentsData
        .map((s) => (students ? students.find((student) => student.userID === s.userID) : undefined))
        .filter((s) => s !== undefined);

      setAcceptedStudents(_acceptedStudents);
    }
  }, [acceptedStudentsData]);

  if (studentLoading || acceptedLoading) {
    return <div>Loading students...</div>;
  } else if (studentError || acceptedError || students === undefined || acceptedStudents === undefined) {
    return <div>Failed to load students.</div>;
  }

  const acceptanceRatio = acceptedStudents.length / students.length;
  const acceptedPercentage = isNaN(Math.round(acceptanceRatio * 100)) ? 0 : Math.round(acceptanceRatio * 100);

  return (
    <div>
      <span>
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={true} disabled />
        &nbsp; If enabled only the students with explicit access may use the application. When disabled all enrolled
        students are able to use the application.
      </span>

      <Divider />

      <span>
        Accepted: {acceptedPercentage} <small>({Math.round((acceptedStudents.length / students.length) * 100)}%)</small>
      </span>

      <br />

      <Space>
        <Button
          className='custom-default-button'
          onClick={() => {
            setAcceptedStudents(students);
          }}
        >
          Select all
        </Button>
        <Button
          className='custom-default-button'
          onClick={() => {
            setAcceptedStudents([]);
          }}
        >
          Deselect all
        </Button>
        <Button
          onClick={() => {
            void Swal.fire({
              title: 'Percentage of students to accept',
              input: 'number',
              inputAttributes: {
                autocapitalize: 'off',
              },
              showCancelButton: true,
              confirmButtonText: 'Randomize',
              showLoaderOnConfirm: true,
              preConfirm: (percentage) => {
                const _p = parseInt(percentage as string);

                if (_p < 10) {
                  Swal.showValidationMessage(`The acceptance percentage must be above 10%!`);
                  return;
                }

                if (_p > 100) {
                  Swal.showValidationMessage(`Percentages can't exceed 100%.`);
                }
              },
              allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
                const percentage = parseInt(result.value as unknown as string);
                const n = Math.ceil(students.length * (percentage / 100));
                const _a = students.sort(() => 0.5 - Math.random()).slice(0, n);
                setAcceptedStudents(_a);

                void Swal.fire('Task completed!', '', 'success');
              }
            });
          }}
        >
          Random assign
        </Button>
        <Button
          className='min-w-20 !border-none bg-success hover:!border-none hover:!bg-success/80 [&_span]:text-text'
          disabled={isPending}
          onClick={() => {
            setAcceptedStudentsRoute(acceptedStudents.map((s) => ({ userID: s.userID, accepted: true })));
          }}
        >
          Save
        </Button>
      </Space>

      <Divider />

      <div>
        <Row>
          {students
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((student: User) => (
              <Col xs={12} md={8} lg={6} xl={4} key={student.userID}>
                <div
                  className={`py-[5px] ${isObjectInArray(student, acceptedStudents) ? 'font-bold text-primary' : ''}`}
                  onClick={() => {
                    if (isObjectInArray(student, acceptedStudents)) {
                      setAcceptedStudents(acceptedStudents.filter((s) => s.userID !== student.userID));
                    } else {
                      setAcceptedStudents([...acceptedStudents, student]);
                    }
                  }}
                >
                  <span>{student.name}</span>
                  <br />
                  <small>{student.userID}</small>
                </div>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};

export default AcceptListSettings;
