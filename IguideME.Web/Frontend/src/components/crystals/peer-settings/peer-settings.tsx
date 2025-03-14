import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { App, Button, Form, InputNumber, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getPeerSettings, postPeerSettings } from '@/api/course_settings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement } from 'react';

const PeerSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['peer-settings'],
    queryFn: getPeerSettings,
  });

  if (isError || isLoading || data === undefined) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-20 bg-surface1'>
          {(isError || (data === undefined && !isLoading)) && (
            <QueryError className='top-[-30px]' title='Failed to load peer settings' />
          )}
        </div>
      </QueryLoading>
    );
  }

  return <PeerSettingsForm minSize={data.min_size} />;
};

interface Props {
  minSize: number;
}

const PeerSettingsForm: FC<Props> = ({ minSize }): ReactElement => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate: savePeer } = useMutation({
    mutationFn: postPeerSettings,

    onMutate: () => {
      void message.open({
        key: 'peer',
        type: 'loading',
        content: 'Saving peer settings...',
      });
    },

    onError: () => {
      void message.open({
        key: 'peer',
        type: 'error',
        content: 'Error saving peer settings',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['peer-settings'] });

      void message.open({
        key: 'peer',
        type: 'success',
        content: 'Peer settings saved successfully',
        duration: 3,
      });
    },
  });

  return (
    <Form name='peer_settings_form' initialValues={{ min_size: minSize }} onFinish={savePeer}>
      <div className='flex justify-between'>
        <Form.Item className='[&_label]:!text-sm [&_label]:!text-text' name='min_size' label='Minimum group size'>
          <InputNumber
            className='antNumberInput w-full !border border-solid !border-accent/50 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
            min={2}
            variant='borderless'
          />
        </Form.Item>
        <Form.Item
          className='[&_label]:!text-sm [&_label]:!text-text'
          name='personalized_peers'
          label='Personalized'
          valuePropName='checked'
        >
          <Switch defaultChecked checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Form.Item>
      </div>

      <Form.Item className='m-0 flex justify-end'>
        <Button className='custom-default-button min-w-20' htmlType='submit'>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PeerSettings;
