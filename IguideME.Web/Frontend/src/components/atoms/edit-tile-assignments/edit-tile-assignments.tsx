import SelectAssignments from './SelectAssignments';
import { Form, InputNumber, Select } from 'antd';
import { GradingType, printGradingType } from '@/types/tile';
import { type FC, type ReactElement } from 'react';

const { Item } = Form;

const EditTileAssignments: FC = (): ReactElement => {
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
      <div className='col-span-3'>
        <p>Assignments:</p>
        <Item name='entries' className='w-full m-0'>
          <SelectAssignments value={[]} onChange={() => {}} />
        </Item>
      </div>
    </>
  );
};

export default EditTileAssignments;
