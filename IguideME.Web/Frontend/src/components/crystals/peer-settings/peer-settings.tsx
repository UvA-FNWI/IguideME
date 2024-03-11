import { Button, Col, Form, InputNumber, Row, Switch } from 'antd';

import { type FC, type ReactElement } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import { getPeerSettings, postPeerSettings } from '@/api/course_settings';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loading from '@/components/particles/loading';

const PeerSettings: FC = (): ReactElement => {
  const { data } = useQuery('peer-settings', getPeerSettings);

  if (data === undefined) {
    return (
      <div className="min-h-20">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <PeerSettingsForm minSize={data.min_size} personalizedPeers={data.personalized_peers} />
    </div>
  );
};

interface Props {
  minSize: number;
  personalizedPeers: boolean;
}

const PeerSettingsForm: FC<Props> = ({ minSize, personalizedPeers }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: savePeer } = useMutation({
    mutationFn: postPeerSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries('peer-settings');
    },
  });
  return (
    <Form
      name="peer_settings_form"
      initialValues={{ min_size: minSize, personalized_peers: personalizedPeers }}
      onFinish={savePeer}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Form.Item name="min_size" label="Minimum group size" className="m-0">
            <InputNumber min={2} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="personalized_peers" label="Personalized" valuePropName="checked" className="m-[10px]">
            <Switch defaultChecked checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end">
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
