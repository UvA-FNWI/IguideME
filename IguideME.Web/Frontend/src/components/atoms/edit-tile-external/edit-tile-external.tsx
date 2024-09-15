import SelectExternal from './select-external';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, InputNumber, Select, Switch } from 'antd';
import { type FC, type ReactElement } from 'react';
import { GradingType, printGradingType } from '@/types/grades';

const EditTileExternal: FC = (): ReactElement => {
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
            className='w-full [&>div]:!border-accent/70 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!border-accent [&>div]:hover:!bg-surface2 [&_span]:!text-text'
            dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
          />
        </Form.Item>
      </div>
      <p>Weight:</p>
      <div className='col-span-2'>
        <Form.Item name='weight' noStyle>
          <InputNumber<number>
            className='w-full !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
            formatter={(value) => `${((value ?? 0) * 100).toFixed(1)}%`}
            parser={(value) => parseFloat((value ?? '0').replace('%', '')) / 100}
            step={0.01}
            variant='borderless'
          />
        </Form.Item>
      </div>
      <p>Data:</p>
      <div className='col-span-2'>
        <Form.Item name='alt' noStyle valuePropName='checked'>
          <Switch className='float-end' checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
        </Form.Item>
      </div>
      <div className='col-span-3'>
        <Form.Item name='entries' className='m-0 w-full'>
          <SelectExternal value={[]} onChange={() => {}} />
        </Form.Item>
      </div>
    </>
  );
};

export default EditTileExternal;
