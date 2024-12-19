import { getCourseDetailsSettings, postCourseDetailsSettings } from '@/api/course_settings';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, DatePicker, Form } from 'antd';
import type { FC, ReactElement } from 'react';

const CourseDetailSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['course-details-settings'],
    queryFn: getCourseDetailsSettings,
  });

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postCourseDetailsSettings,

    onMutate: () => {
      void message.open({
        key: 'course-details-settings',
        type: 'loading',
        content: 'Saving course details...',
      });
    },

    onError: () => {
      void message.open({
        key: 'course-details-settings',
        type: 'error',
        content: 'Error saving course details',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-details-settings'] });

      void message.open({
        key: 'course-details-settings',
        type: 'success',
        content: 'Course details saved successfully',
        duration: 3,
      });
    },
  });

  if (isError) {
    return <QueryError className='!relative' title='Failed to load course details settings' />;
  }

  return (
    <QueryLoading isLoading={isLoading}>
      <p className='mb-2 text-sm text-text'>Set the end date of your course.</p>
      <Form
        onFinish={(values: any) => {
          mutate({ course_end_date: values.course_end_date });
        }}
        initialValues={{ course_end_date: data ? new Date(data.course_end_date) : undefined }}
        requiredMark={false}
      >
        <Form.Item name='course_end_date' label='Course end date' required rules={[{ required: true }]} hasFeedback>
          <DatePicker />
        </Form.Item>
        <div className='flex justify-end'>
          <Button className='custom-default-button right-0 min-w-20' htmlType='submit'>
            Save
          </Button>
        </div>
      </Form>
    </QueryLoading>
  );
};

export default CourseDetailSettings;
