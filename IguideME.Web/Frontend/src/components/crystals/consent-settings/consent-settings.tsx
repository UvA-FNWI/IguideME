import Loading from '@/components/particles/loading';
import QueryError from '@/components/particles/QueryError';
import { Button, Form } from 'antd';
import { getConsentSettings, postConsentSettings } from '@/api/course_settings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

const ConsentSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['consent-settings'],
    queryFn: getConsentSettings,
  });

  if (isError) return <QueryError />;
  else if (isLoading) return <Loading />;

  return <ConsentSettingsForm name={data!.course_name} text={data!.text} />;
};

interface Props {
  name: string;
  text: string;
}

const ConsentSettingsForm: FC<Props> = ({ name, text }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: saveConsent } = useMutation({
    mutationFn: postConsentSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['consent-settings'] });
    },
  });

  return (
    <div>
      <Form initialValues={{ name, text }} name="consent_settings_form" onFinish={saveConsent}>
        <Form.Item name="text" valuePropName="text" noStyle>
          TODO
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Save</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ConsentSettings;
