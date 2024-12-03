import { getExternalAssignmentSubmissions } from '@/api/entries';
import { uploadData } from '@/api/tiles';
import { GradingType, printGrade } from '@/types/grades';
import type { Assignment } from '@/types/tile';
import type { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Table } from 'antd';
import { useCallback, useMemo, useState, type FC } from 'react';
import UploadManagerAdd from './upload-manager-add';

export interface UploadManagerProps {
  assignment: Assignment;
  students: User[];
}

export interface UploadManagerAddFormValues {
  idColumn: number;
  gradeColumn: number;
  data: string[][];
}

const UploadManagerShow: FC<UploadManagerProps> = ({ assignment, students }) => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: [`external-assignment-${assignment.id}`, 'submissions'],
    queryFn: async () => await getExternalAssignmentSubmissions(assignment.id),
  });

  const tableData = useMemo(() => {
    if (!submissions) return [];

    return submissions.map((submission) => ({
      studentId: submission.userID,
      grade: printGrade(
        assignment.grading_type,
        submission.grade,
        assignment.max_grade,
        assignment.grading_type === GradingType.NotGraded,
      ),
    }));
  }, [submissions]);

  const [form] = Form.useForm<UploadManagerAddFormValues>();
  const [UploadManagerDrawerOpen, setUploadManagerDrawerOpen] = useState<boolean>(false);

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: uploadData,

    onMutate: () => {
      void message.open({
        key: 'upload',
        type: 'loading',
        content: 'Uploading data...',
      });
    },

    onError: () => {
      void message.open({
        key: 'upload',
        type: 'error',
        content: 'Error uploading data',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [`external-assignment-${assignment.id}`, 'submissions'],
      });
      setUploadManagerDrawerOpen(false);
      void message.open({
        key: 'upload',
        type: 'success',
        content: 'Data uploaded successfully',
        duration: 3,
      });
    },
  });

  const onClose = useCallback(() => {
    setUploadManagerDrawerOpen(false);
  }, []);

  const onSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  return (
    <>
      <div className='flex flex-col gap-8'>
        <div>
          <h4 className='mb-4 text-lg'>Upload Data</h4>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-base text-text'>
                Upload data for the external assignment <strong>{assignment.title}</strong>.
              </p>
              <p className='text-base text-failure'>
                Note: The data will overwrite any existing data for this assignment.
              </p>
            </div>
            <Button
              className='custom-default-button'
              onClick={() => {
                setUploadManagerDrawerOpen((prev) => !prev);
              }}
            >
              Add Data
            </Button>
          </div>
        </div>
        <div>
          <h4 className='mb-4 text-lg'>Currently Uploaded Data</h4>
          <Table
            className='custom-table'
            dataSource={tableData}
            loading={isLoading}
            columns={[
              {
                title: 'Student ID',
                dataIndex: 'studentId',
                key: 'studentId',
              },
              {
                title: 'Grade',
                dataIndex: 'grade',
                key: 'grade',
                sorter: (a, b) => {
                  if (!isNaN(parseFloat(a.grade)) && !isNaN(parseFloat(b.grade))) {
                    return parseFloat(a.grade) - parseFloat(b.grade);
                  } else {
                    return a.grade.localeCompare(b.grade);
                  }
                },
              },
            ]}
          />
        </div>
      </div>
      <Drawer
        className='!bg-mantle [&>div>div>div]:!text-text [&_button]:!text-text'
        width='min(100vw,800px)'
        title='Add Data'
        open={UploadManagerDrawerOpen}
        onClose={onClose}
        extra={
          <div className='flex items-center gap-4'>
            <Button onClick={onClose} className='custom-default-button'>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={onSubmit}
              className='min-w-20 !border-none bg-success hover:!border-none hover:!bg-success/80 [&_span]:text-text'
            >
              Submit
            </Button>
          </div>
        }
      >
        <Form
          initialValues={{ idColumn: 0, gradeColumn: 1, data: [['', '']] }}
          requiredMark={false}
          form={form}
          onFinish={(values) => {
            mutate({
              assignmentId: assignment.id,
              idColumn: values.idColumn,
              gradeColumn: values.gradeColumn,
              data: values.data,
            });
          }}
        >
          <UploadManagerAdd assignment={assignment} form={form} students={students} />
        </Form>
      </Drawer>
    </>
  );
};

export default UploadManagerShow;
