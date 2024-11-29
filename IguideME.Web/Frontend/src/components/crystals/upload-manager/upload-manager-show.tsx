import type { Assignment } from '@/types/tile';
import type { User } from '@/types/user';
import { App, Button, Drawer, Form } from 'antd';
import UploadManagerAdd from './upload-manager-add';
import { useCallback, useState, type FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadData } from '@/api/tiles';

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
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });
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
      <Button
        className='custom-default-button'
        onClick={() => {
          setUploadManagerDrawerOpen((prev) => !prev);
        }}
      >
        Add Data
      </Button>
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
          initialValues={{ idColumn: 0, gradeColumn: 1, data: [['']] }}
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
