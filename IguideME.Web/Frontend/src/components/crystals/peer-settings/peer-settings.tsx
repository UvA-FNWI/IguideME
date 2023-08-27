import { Button, Col, Form, InputNumber, Row, Switch } from 'antd';

import { FC, ReactElement } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import { getPeerSettings, postPeerSettings } from '@/api/course_settings';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const PeerSettings: FC = (): ReactElement => {

  const { data } = useQuery("peer-settings", getPeerSettings);

  if (!data) {
    return (<>Loading...</>);
  }

  return (
    <div>
      <PeerSettingsForm min_size={data.min_size} personalized_peers={data.personalized_peers}/>
    </div>
  )
}

type Props = {
  min_size: number;
  personalized_peers: boolean;
}

const PeerSettingsForm: FC<Props> = ({min_size, personalized_peers}): ReactElement => {
  const queryClient = useQueryClient();
  const {mutate: savePeer} = useMutation({mutationFn: postPeerSettings, onSuccess: () => queryClient.invalidateQueries('peer-settings')})
  return (
    <Form name='peer_settings_form'
              initialValues={{min_size, personalized_peers}}
              onFinish={savePeer}
              >
      <Row justify='space-between' align='middle'>
        <Col>
          <Form.Item name='min_size' label='Minimum group size' style={{margin: 0}}>
          <InputNumber min={2}/>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name='personalized_peers' label='Personalized' valuePropName='checked' style={{margin: 10}}>
            <Switch defaultChecked
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}/>
          </Form.Item>
        </Col>
      </Row>
      <Row justify='end'>
        <Col>
          <Form.Item style={{margin: '0px 10px 5px 0px'}}>
            <Button htmlType='submit'>
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}


export default PeerSettings
