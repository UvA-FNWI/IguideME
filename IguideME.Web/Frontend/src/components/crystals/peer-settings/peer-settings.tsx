import Loading from '@/components/particles/loading';
import { Button, Col, Form, InputNumber, Row, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getPeerSettings, postPeerSettings } from '@/api/course_settings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type FC, type ReactElement } from 'react';

const PeerSettings: FC = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ['peer-settings'],
    queryFn: getPeerSettings,
  });

  if (data === undefined) {
    return (
      <div className="min-h-20">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <PeerSettingsForm minSize={data.min_size} />
    </div>
  );
};

interface Props {
  minSize: number;
}

const PeerSettingsForm: FC<Props> = ({ minSize }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: savePeer } = useMutation({
    mutationFn: postPeerSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['peer-settings'] });
    },
  });
  return (
    <Form
      name="peer_settings_form"
      initialValues={{ min_size: minSize }}
      onFinish={savePeer}
    >
      <Row className="justify-between content-center">
        <Col>
          <Form.Item name="min_size" label="Minimum group size" className="m-0">
            <InputNumber min={2} />
          </Form.Item>
        </Col>
      </Row>
      <Row className="justify-end">
        <Col>
          <Form.Item className="mr-[10px] mb-[5px]">
            <Button htmlType="submit">Save</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PeerSettings;
