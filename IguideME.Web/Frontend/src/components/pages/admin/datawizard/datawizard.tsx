import { getStudentsByCourse } from '@/api/courses';
import {
  getExternalAssignments,
  patchExternalAssignmentTitle,
  postExternalAssignment,
  deleteExternalAssignment,
} from '@/api/entries';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import UploadManager from '@/components/crystals/upload-manager/upload-manager';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { GradingType } from '@/types/grades';
import { type Assignment } from '@/types/tile';
import { type User } from '@/types/user';
import { useRequiredParams } from '@/utils/params';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Tooltip } from 'antd';
import { useState, type FC, type ReactElement } from 'react';
import AssignmentSettingsForm from './assignment-settings-form';
import Swal from 'sweetalert2';

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
      html_url: '',
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
        <div className='bg-surface1 h-[100px] w-full rounded-lg' />
      </QueryLoading>
    );
  } else if (assignmentError || studentsError) {
    return (
      <div className='bg-surface1 relative h-[100px] w-full rounded-lg'>
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
        className='bg-accent/30 hover:!border-border1 hover:!bg-accent/70 [&_span]:!text-text ml-auto !w-fit hover:border-solid'
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
  const { mutate: patchExternalAssignment } = useMutation({
    mutationFn: patchExternalAssignmentTitle,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });
    },
  });

  const { mutate: deleteExternalAss } = useMutation({
    mutationFn: deleteExternalAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });
    },
  });

  return (
    <div className='border-border0 bg-surface2 rounded-md border border-solid px-8 py-4'>
      <div className='mb-5 flex flex-wrap items-center justify-between'>
        <button
          onClick={() => {
            setEditing(true);
          }}
        >
          {editing ?
            <Tooltip title='Press Enter to save'>
              <Input
                className='border-accent bg-surface1 text-text hover:border-accent/50 hover:bg-surface1 focus:border-accent focus:bg-surface1 focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure w-full focus:shadow-sm'
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
                  patchExternalAssignment({
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
          <div className='ml-auto flex flex-wrap items-center justify-center gap-2'>
            <Button
              className='custom-default-button'
              onClick={() => {
                setUploadMenuOpen(true);
              }}
            >
              New Upload
            </Button>
            <Button
              className='custom-danger-button'
              onClick={() => {
                void Swal.fire({
                  title: 'Warning: This will permanently delete the tile!',
                  icon: 'warning',
                  focusCancel: true,
                  showCancelButton: true,
                  confirmButtonText: 'Delete',
                  cancelButtonText: 'Cancel',
                  customClass: {},
                }).then((result) => {
                  if (result.isConfirmed) {
                    deleteExternalAss({ assignmentID: assignment.id });
                  }
                });
              }}
            >
              Delete External Assignment
            </Button>
          </div>
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
