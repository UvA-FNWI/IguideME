import SelectAssignments from './SelectAssignments';
import { Form, InputNumber, Select, Switch } from 'antd';
import { GradingType, printGradingType } from '@/types/tile';
import { type FC, type ReactElement } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Item } = Form;

const EditTileAssignments: FC = (): ReactElement => {
  // TODO the loading handling for entries seems to be different here
  return (
    <>
      <p>Grading:</p>
      <div className='col-span-2'>
        <Item name='gradingType' noStyle>
          <Select
            options={Object.entries(GradingType)
              .filter((key, _) => isNaN(Number(key[0])))
              .map((_, val) => ({
                value: val,
                label: printGradingType(val),
              }))}
            className='w-full [&>div]:!bg-cardBackground [&>div]:!border-primary-500 [&>div]:hover:!bg-dropdownBackground [&_span]:!text-text'
            dropdownClassName='bg-dropdownBackground [&_div]:!text-text selectionSelected'
          />
        </Item>
      </div>
      <p>Weight:</p>
      <div className='col-span-2'>
        <Item name='weight' noStyle>
          <InputNumber<number>
            className='w-full !border-primary-500 hover:!border-primary-500 !bg-cardBackground hover:!bg-dropdownBackground [&_input]:!text-text antNumberInput'
            formatter={(value) => `${(value ?? 0) * 100}%`}
            parser={(value) => +parseFloat(value!.replace('%', '')).toFixed(1) / 100}
          />
        </Item>
      </div>
      <p>Assignments:</p>
      <div className='col-span-2'>
        <Item name='alt' noStyle valuePropName='checked'>
          <Switch className='float-end' checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Item>
      </div>
      <div className='col-span-3'>
        <Item name='entries' className='w-full m-0'>
          <SelectAssignments value={[]} onChange={() => {}} />
        </Item>
      </div>
    </>
  );
};


export default EditTileAssignments;
