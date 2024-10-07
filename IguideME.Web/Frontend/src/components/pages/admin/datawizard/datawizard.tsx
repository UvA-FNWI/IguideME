import { getStudentsByCourse } from '@/api/courses';
import { getExternalAssignments, patchExternalAssignment, postExternalAssignment } from '@/api/entries';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import UploadManager from '@/components/crystals/upload-manager/upload-manager';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { GradingType } from '@/types/grades';
import { Assignment } from '@/types/tile';
import { User } from '@/types/user';
import { useRequiredParams } from '@/utils/params';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Tooltip } from 'antd';
import { useState, type FC, type ReactElement } from 'react';
import AssignmentSettingsForm from './assignment-settings-form';

const DataWizard: FC = (): ReactElement => {
  return (
    <>
      <AdminTitle title='Data Wizard' description='Upload custom data into IguideME.' />
      <Wizard />
    </>
  );
};

const Wizard: FC = (): ReactElement => {
  const {
    data: assignments,
    isError: assignmentError,
    isLoading: assignmentLoading,
  } = useQuery({
    queryKey: ['external-assignments'],
    queryFn: getExternalAssignments,
  });

  const { courseId } = useRequiredParams(['courseId']);
  const {
    data: students,
    isLoading: studentsLoading,
    isError: studentsError,
  } = useQuery({
    queryKey: ['students', courseId],
    queryFn: async () => await getStudentsByCourse(courseId),
  });

  const queryClient = useQueryClient();
  const { mutate: postAssignment } = useMutation({
    mutationFn: postExternalAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });
    },
  });

  const addAssignment = (): void => {
    postAssignment({
      id: -1,
      course_id: -1,
      title: 'Title',
      published: 2,
      muted: false,
      due_date: -1,
      max_grade: 0,
      grading_type: GradingType.Points,
    });
  };

  if (assignmentLoading || studentsLoading) {
    return (
      <QueryLoading isLoading={assignmentLoading || studentsLoading}>
        <div className='h-[100px] w-full rounded-lg bg-surface1' />
      </QueryLoading>
    );
  } else if (assignmentError || studentsError) {
    return (
      <div className='h-[100px] w-full rounded-lg bg-surface1'>
        <QueryError title='Error: Unable to load external data' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <Button
        type='dashed'
        onClick={addAssignment}
        block
        icon={<PlusOutlined />}
        className='ml-auto !w-fit bg-accent/30 hover:border-solid hover:!border-border1 hover:!bg-accent/70 [&_span]:!text-text'
      >
        Add External Assignment
      </Button>
      <div className='space-y-4'>
        {assignments?.map((ass) => <ViewExternalAssignment key={ass.id} assignment={ass} students={students ?? []} />)}
      </div>
    </div>
  );
};

interface ViewExternalAssignmentProps {
  assignment: Assignment;
  students: User[];
}

const ViewExternalAssignment: FC<ViewExternalAssignmentProps> = ({ assignment, students }): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(assignment.title);
  const [uploadMenuOpen, setUploadMenuOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: patchExternalAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });
    },
  });

  return (
    <div className='rounded-md border border-solid border-border0 bg-surface2 px-8 py-4'>
      <div className='mb-5 flex items-center justify-between'>
        <button onClick={() => setEditing(true)}>
          {editing ?
            <Tooltip title='Press Enter to save'>
              <Input
                className='w-full border-accent bg-surface1 text-text hover:border-accent/50 hover:bg-surface1 focus:border-accent focus:bg-surface1 focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
                value={title}
                autoFocus
                onBlur={() => {
                  setEditing(false);
                }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  mutate({
                    id: assignment.id,
                    title,
                  });
                  setEditing(false);
                }}
              />
            </Tooltip>
          : <Tooltip title='Click to edit'>
              <h3 className='text-lg'>
                <b>{assignment.title}</b>
              </h3>
            </Tooltip>
          }
        </button>
        {!uploadMenuOpen && (
          <Button
            className='custom-default-button ml-auto'
            onClick={() => {
              setUploadMenuOpen(true);
            }}
          >
            New Upload
          </Button>
        )}
      </div>
      {uploadMenuOpen && (
        <div className='mb-5 flex'>
          <UploadManager
            assignment={assignment}
            students={students}
            closeUploadMenu={() => {
              setUploadMenuOpen(false);
            }}
          />
        </div>
      )}
      <div className='space-y-2'>
        <h4 className='text-lg'>Settings</h4>
        <AssignmentSettingsForm assignment={assignment} />
      </div>
    </div>
  );
};

export default DataWizard;
