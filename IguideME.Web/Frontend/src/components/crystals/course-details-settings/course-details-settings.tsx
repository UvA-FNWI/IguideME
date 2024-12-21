import { getCourseDetailsSettings, postCourseDetailsSettings } from '@/api/course_settings';
import QueryError from '@/components/particles/QueryError';
import dayjs from 'dayjs';
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
  } else if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <p className='mb-2 text-sm text-text'>Set the start date of your course.</p>
      <Form
        onFinish={(values: { course_start_date: any }) => {
          mutate(values.course_start_date.toDate().getTime() / 1000);
        }}
        initialValues={{ course_start_date: data ? dayjs(data * 1000) : undefined }}
        requiredMark={false}
      >
        <Form.Item name='course_start_date' label='Course end date' required rules={[{ required: true }]} hasFeedback>
          <DatePicker />
        </Form.Item>
        <div className='flex justify-end'>
          <Button className='custom-default-button right-0 min-w-20' htmlType='submit'>
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CourseDetailSettings;
