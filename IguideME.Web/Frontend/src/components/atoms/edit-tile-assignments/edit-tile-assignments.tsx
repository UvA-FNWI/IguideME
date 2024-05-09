import { GradingType, printGradingType } from '@/types/tile';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, InputNumber, Select, Switch } from 'antd';
import { type FC, type ReactElement } from 'react';
import SelectAssignments from './SelectAssignments';

const EditTileAssignments: FC = (): ReactElement => {
  return (
    <>
      <p>Grading:</p>
      <div className='col-span-2'>
        <Form.Item name='gradingType' noStyle>
          <Select
            options={Object.entries(GradingType)
              .filter((key, _) => isNaN(Number(key[0])))
              .map((_, val) => ({
                value: val,
                label: printGradingType(val),
              }))}
            className='w-full [&>div]:!border-primary [&>div]:!bg-card-background [&>div]:!shadow-none [&>div]:hover:!bg-card [&_span]:!text-text'
            dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
          />
        </Form.Item>
      </div>
      <p>Weight:</p>
      <div className='col-span-2'>
        <Form.Item name='weight' noStyle>
          <InputNumber<number>
            className='antNumberInput w-full !border border-solid !border-primary !bg-card-background hover:!border-primary hover:!bg-card [&_input]:!text-text'
            formatter={(value) => `${(value ?? 0) * 100}%`}
            parser={(value) => +parseFloat(value!.replace('%', '')).toFixed(1) / 100}
            variant='borderless'
          />
        </Form.Item>
      </div>
      <p>Assignments:</p>
      <div className='col-span-2'>
        <Form.Item name='alt' noStyle valuePropName='checked'>
          <Switch className='float-end' checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Form.Item>
      </div>
      <div className='col-span-3'>
        <Form.Item name='entries' className='m-0 w-full'>
          <SelectAssignments value={[]} onChange={() => {}} />
        </Form.Item>
      </div>
    </>
  );
};

export default EditTileAssignments;
