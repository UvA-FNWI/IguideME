import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { App, Button, Form } from 'antd';
import { getConsentSettings, postConsentSettings } from '@/api/course_settings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

const ConsentSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['consent-settings'],
    queryFn: getConsentSettings,
  });

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate: saveConsent } = useMutation({
    mutationFn: postConsentSettings,

    onMutate: () => {
      void message.open({
        key: 'consent',
        type: 'loading',
        content: 'Saving consent settings...',
      });
    },

    onError: () => {
      void message.open({
        key: 'consent',
        type: 'error',
        content: 'Error saving consent settings',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['consent-settings'] });

      void message.open({
        key: 'consent',
        type: 'success',
        content: 'Consent settings saved successfully',
        duration: 3,
      });
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
