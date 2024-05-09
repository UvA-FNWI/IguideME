import { getPeerSettings, postPeerSettings } from '@/api/course_settings';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, Switch } from 'antd';
import { useEffect, type FC, type ReactElement } from 'react';
import { toast } from 'sonner';

const PeerSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['peer-settings'],
    queryFn: getPeerSettings,
  });

  if (isError || isLoading || data === undefined) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-20 bg-card-background'>
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
  const queryClient = useQueryClient();
  const { mutate: savePeer, status } = useMutation({
    mutationFn: postPeerSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['peer-settings'] });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success('Peer settings saved successfully', {
        closeButton: true,
      });
    } else if (status === 'error') {
      toast.error('Failed to save peer settings', {
        closeButton: true,
      });
    }
  }, [status]);

  return (
    <Form name='peer_settings_form' initialValues={{ min_size: minSize }} onFinish={savePeer}>
      <div className='flex justify-between'>
        <Form.Item className='[&_label]:!text-sm [&_label]:!text-text' name='min_size' label='Minimum group size'>
          <InputNumber
            className='antNumberInput w-full !border border-solid !border-primary !bg-card-background hover:!border-primary hover:!bg-card [&_input]:!text-text'
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
        <Button
          className='min-w-20 !border-none bg-button hover:!border-none hover:!bg-button-hover [&_span]:text-text'
          htmlType='submit'
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PeerSettings;
