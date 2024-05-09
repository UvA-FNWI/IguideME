import { getConsentSettings, postConsentSettings } from '@/api/course_settings';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form } from 'antd';
import { type FC, type ReactElement } from 'react';

const ConsentSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['consent-settings'],
    queryFn: getConsentSettings,
  });

  const queryClient = useQueryClient();
  const { mutate: saveConsent } = useMutation({
    mutationFn: postConsentSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['consent-settings'] });
    },
  });

  if (isError) return <QueryError title='Failed to load consent settings' />;
  else {
    return (
      <QueryLoading isLoading={isLoading}>
        <Form
          initialValues={data ? { course_name: data.course_name, text: data.text } : undefined}
          name='consent_settings_form'
          onFinish={saveConsent}
        >
          <Form.Item name='text' valuePropName='text' noStyle>
            TODO
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit'>Save</Button>
          </Form.Item>
        </Form>
      </QueryLoading>
    );
  }
};

export default ConsentSettings;
