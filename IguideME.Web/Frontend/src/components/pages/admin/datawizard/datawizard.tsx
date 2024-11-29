import { getStudentsByCourse } from '@/api/courses';
import {
  getExternalAssignments,
  patchExternalAssignmentTitle,
  postExternalAssignment,
  deleteExternalAssignment,
} from '@/api/entries';
import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { GradingType } from '@/types/grades';
import { type Assignment } from '@/types/tile';
import { type User } from '@/types/user';
import { useRequiredParams } from '@/utils/params';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Drawer } from 'antd';
import { useState, type FC, type ReactElement } from 'react';
import AssignmentSettingsForm from './assignment-settings-form';
import Swal from 'sweetalert2';
import EditTitle from '@/components/crystals/edit-title/edit-title';
import UploadManagerShow from '@/components/crystals/upload-manager/upload-manager-show';

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

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate: postAssignment } = useMutation({
    mutationFn: postExternalAssignment,

    onMutate: () => {
      void message.open({
        key: 'external-assignment',
        type: 'loading',
        content: 'Adding external assignment...',
      });
    },

    onError: () => {
      void message.open({
        key: 'external-assignment',
        type: 'error',
        content: 'Error adding external assignment',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });

      void message.open({
        key: 'external-assignment',
        type: 'success',
        content: 'External assignment added successfully',
        duration: 3,
      });
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
        <div className='h-[100px] w-full rounded-lg bg-surface1' />
      </QueryLoading>
    );
  } else if (assignmentError || studentsError) {
    return (
      <div className='relative h-[100px] w-full rounded-lg bg-surface1'>
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
  const [uploadMenuOpen, setUploadMenuOpen] = useState<boolean>(false);

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate: patchExternalAssignment } = useMutation({
    mutationFn: patchExternalAssignmentTitle,

    onMutate: () => {
      void message.open({
        key: 'external-assignment-patch',
        type: 'loading',
        content: 'Saving title...',
      });
    },

    onError: () => {
      void message.open({
        key: 'external-assignment-patch',
        type: 'error',
        content: 'Error saving title',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });

      void message.open({
        key: 'external-assignment-patch',
        type: 'success',
        content: 'Title saved successfully',
        duration: 3,
      });
    },
  });

  const { mutate: deleteExternalAss } = useMutation({
    mutationFn: deleteExternalAssignment,

    onMutate: () => {
      void message.open({
        key: 'external-assignment-delete',
        type: 'loading',
        content: 'Deleting external assignment...',
      });
    },

    onError: () => {
      void message.open({
        key: 'external-assignment-delete',
        type: 'error',
        content: 'Error deleting external assignment',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });

      void message.open({
        key: 'external-assignment-delete',
        type: 'success',
        content: 'External assignment deleted successfully',
        duration: 3,
      });
    },
  });

  const saveTitleChange = (title: string): void => {
    patchExternalAssignment({
      id: assignment.id,
      title,
    });
  };

  return (
    <Card
      className='custom-card-no-hover !bg-surface1'
      size='small'
      title={
        <div className='flex py-3'>
          <EditTitle title={assignment.title} onSave={saveTitleChange} />
          {!uploadMenuOpen && (
            <div className='ml-auto flex flex-wrap items-center justify-center gap-2'>
              <Button
                className='custom-default-button'
                onClick={() => {
                  setUploadMenuOpen(true);
                }}
              >
                Show / Modify Uploads
              </Button>
              <Button
                className='custom-danger-button'
                onClick={() => {
                  void Swal.fire({
                    title: 'Warning: This will permanently delete the assignment!',
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
      }
    >
      <Drawer
        className='!bg-mantle [&>div>div>div]:!text-text [&_button]:!text-text'
        width='min(100vw,800px)'
        title='Uploads'
        open={uploadMenuOpen}
        onClose={() => {
          setUploadMenuOpen(false);
        }}
      >
        <UploadManagerShow assignment={assignment} students={students} />
      </Drawer>
      <div className='flex flex-wrap justify-between'>
        <div className='shrink-0 space-y-2'>
          <h4 className='text-lg'>Settings</h4>
          <AssignmentSettingsForm assignment={assignment} />
        </div>
        <div className='mx-4 w-px shrink-0 bg-text/10' />
        <div className='flex flex-grow'>
          <div>
            <Card size='small' title={<h5 className='text-base text-text'>Statistics</h5>}>
              <div className='text-sm'>
                <p>Due Date: {assignment.due_date}</p>
                <p>Max Grade: {assignment.max_grade}</p>
                <p>Grading Type: {assignment.grading_type}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataWizard;
