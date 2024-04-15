import { GradingType, printGradingType } from '@/types/tile';
import { Col, Form, InputNumber, Row, Select } from 'antd';
import { type FC, type ReactElement } from 'react';
import SelectAssignments from './SelectAssignments';

const { Item } = Form;

const EditTileAssignments: FC = (): ReactElement => {
  return (
    <>
      <Row className='content-center'>
        <Col span={4} className='grid items-center'>
          Grading:
        </Col>
        <Col span={8}>
          <Item name='gradingType' noStyle>
            <Select
              options={Object.entries(GradingType)
                .filter((key, _) => isNaN(Number(key[0])))
                .map((_, val) => ({
                  value: val,
                  label: printGradingType(val),
                }))}
              className='w-full'
            />
          </Item>
        </Col>
        <Col span={4} offset={1} className='grid items-center'>
          Weight:
        </Col>
        <Col span={7}>
          <Item name='weight' noStyle>
            <InputNumber<number>
              className='w-full'
              formatter={(value) => `${(value ?? 0) * 100}%`}
              parser={(value) => +parseFloat(value!.replace('%', '')).toFixed(1) / 100}
            />
          </Item>
        </Col>
      </Row>
      <Row>
        <p className='mb-1'>Assignments:</p>
        <Item name='entries' className='w-full m-0'>
          <SelectAssignments value={[]} onChange={() => {}} />
        </Item>
      </Row>
    </>
  );
};

export default EditTileAssignments;
