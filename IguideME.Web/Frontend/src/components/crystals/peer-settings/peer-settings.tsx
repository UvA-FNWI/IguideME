import { getPeerSettings, postPeerSettings } from '@/api/course_settings';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, InputNumber, Row, Switch } from 'antd';
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
        <div className='h-20 bg-white'>
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
      <Row className='justify-between content-center'>
        <Col>
          <Form.Item name='min_size' label='Minimum group size' className='m-0'>
            <InputNumber min={2} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name='personalized_peers'
            label='Personalized'
            valuePropName='checked'
            className='m-[10px] [&_button]:bg-black/25'
          >
            <Switch defaultChecked checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
        </Col>
      </Row>
      <Row className='justify-end'>
        <Col>
          <Form.Item className='mr-[10px] mb-[5px]'>
            <Button className='w-16' htmlType='submit'>
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PeerSettings;
