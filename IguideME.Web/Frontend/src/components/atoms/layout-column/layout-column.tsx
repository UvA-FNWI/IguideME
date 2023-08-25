import { Col, Divider, Form, FormInstance, InputNumber, Row, Slider, Transfer } from 'antd';
import { FC, ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { DeleteFilled } from '@ant-design/icons';


import { getTileGroups } from '@/api/tiles';

import './style.scss';
import { LayoutColumn } from '@/types/tile';


const MIN_WIDTH = 1;
const MAX_WIDTH = 100;

type Props = {
    form: FormInstance
    name: number;
    restField: {fieldKey?: number | undefined};
    remove: (index: number | number[]) => void;
}

interface RecordType {
    key: string;
    title: string;
}

const ConfigLayoutColumn: FC<Props> = ({form, name, restField, remove}): ReactElement => {
    const [targetGroups, setTargetGroups] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    useEffect(() => {
        setTargetGroups(form.getFieldValue(['columns', name, 'groups']))
    })

    const { data} = useQuery('tile-groups', getTileGroups);

    const onGroupChange = (nTargetKeys: string[]) => {
        setTargetGroups(nTargetKeys);
        form.setFieldValue(['columns', name, 'groups'], nTargetKeys)
    }

    const onGroupSelectChange = (source: string[], target: string[]) => {
        setSelectedGroups([...source, ...target]);
    }

    const groups: RecordType[] | undefined = data?.map((x) => {return {key: '' + x.id, title: x.title}})

    const formatter = (value: number | undefined) => value !== undefined ? `${value}%` : '';

  return (
    <div className='LayoutColumn'>
        <Row justify={'space-between'} >
            <Col>
                <h3>Title</h3>
            </Col>
            <Col>
                <DeleteFilled onClick={() => remove(name)} />
            </Col>
            <Divider style={{ margin: '10px' }} />

        </Row>
        <Row align='middle' justify='space-between'>
            <Col >
            Width:
            </Col>
            <Col span={14}>
                <Form.Item {...restField} name={[name, 'width']} initialValue={50}>
                    <Slider min={MIN_WIDTH} max={MAX_WIDTH} tooltip={{formatter}}/>
                </Form.Item>
            </Col>
            <Col>
                <Form.Item {...restField} name={[name, 'width']}>
                    <InputNumber min={MIN_WIDTH} max={MAX_WIDTH} formatter={formatter}/>
                </Form.Item>
            </Col>
        <Divider style={{ margin: '5px' }} />
        </Row>
        <Row>
            <Transfer dataSource={groups}
                    //   targetKeys={form.getFieldValue(['columns', name, 'groups'])}
                      targetKeys={targetGroups}
                      selectedKeys={selectedGroups}
                      onChange={onGroupChange}
                      onSelectChange={onGroupSelectChange}
                      render={(item) => item.title}
                      oneWay
                      showSearch/>
        </Row>
    </div>

  )
};

export default ConfigLayoutColumn
