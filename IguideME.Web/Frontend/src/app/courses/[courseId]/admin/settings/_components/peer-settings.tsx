'use client';

import { type ReactElement, useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, Switch } from 'antd';
import { toast } from 'sonner';

import { getPeerSettings, postPeerSettings } from '@/api/course-setting';

import { QueryError } from './query-error';
import { QueryLoading } from './query-loading';

function PeerSettings(): ReactElement {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['peer-settings'],
    queryFn: getPeerSettings,
  });

  if (isError || isLoading || !data) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='bg-surface1 h-20'>
          {isError ?
            <QueryError className='top-[-30px]' title='Failed to load peer settings' />
          : null}
        </div>
      </QueryLoading>
    );
  }

  return <PeerSettingsForm minSize={data.min_size} />;
}

interface PeerSettingsFormProps {
  minSize: number;
}

function PeerSettingsForm({ minSize }: PeerSettingsFormProps): ReactElement {
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
        <Form.Item className='[&_label]:!text-text [&_label]:!text-sm' name='min_size' label='Minimum group size'>
          <InputNumber
            className='antNumberInput !bg-surface1 hover:!bg-surface2 [&_input]:!text-text w-full !border border-solid !border-accent/50 hover:!border-accent'
            min={2}
            variant='borderless'
          />
        </Form.Item>
        <Form.Item
          className='[&_label]:!text-text [&_label]:!text-sm'
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
}

export { PeerSettings };
